pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = "192.168.49.1:5000"
        DOCKER_IMAGE_NAME = "backend-api"
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_IMAGE_FULL_NAME = "${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
        MANIFEST_REPO = "git@github.com:priyen15/CICD-project-k8s.git"
        
        GITHUB_CREDENTIALS = 'ssh-key'
        GITHUB_USERNAME = 'priyen15'
        GITHUB_EMAIL = 'priyenpatel122@gmail.com'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the repository'
                checkout scm
            }
        }
        
        stage('Build Image') {
            steps {
                echo "Building Docker image: ${DOCKER_IMAGE_FULL_NAME}"
                sh "docker build --pull -t ${DOCKER_IMAGE_FULL_NAME} ."
            }
        }
        
        stage('Test Image') {
            steps {
                echo 'Testing the built Docker image'
                
                // Run container in detached mode
                sh "docker run -d --rm --name backend-api-test -p 3000:3000 ${DOCKER_IMAGE_FULL_NAME}"
                
                // Wait for container to be ready
                sh '''
                    echo "Waiting for container to start..."
                    sleep 5
                '''
                
                // Health check
                sh '''
                    echo "Testing health endpoint..."
                    curl --fail http://localhost:3000/health
                '''
                
                // Test API endpoint
                sh '''
                    echo "Testing API endpoint..."
                    curl --fail http://localhost:3000/api
                '''
            }
            post {
                always {
                    // Always stop the test container, even if tests fail
                    sh 'docker stop backend-api-test || true'
                }
            }
        }
        
        stage('Push Image') {
            steps {
                echo "Pushing image to registry: ${DOCKER_IMAGE_FULL_NAME}"
                sh "docker push ${DOCKER_IMAGE_FULL_NAME}"
            }
        }
        
        stage('Update Manifest Repo') {
            steps {
                echo 'Updating Kubernetes manifest repository'
                
                sshagent(credentials: ["${GITHUB_CREDENTIALS}"]) {
                    dir('manifest-repo') {
                        // Clone the manifest repository
                        sh """
                            git clone ${MANIFEST_REPO} .
                        """
                        
                        // Configure git
                        sh """
                            git config user.name "${GITHUB_USERNAME}"
                            git config user.email "${GITHUB_EMAIL}"
                        """
                        
                        // Show current image version
                        sh '''
                            echo "Current image in dev/deployment.yaml:"
                            grep "image:" dev/deployment.yaml || echo "Image line not found"
                        '''
                        
                        // Update image tag in deployment.yaml
                        sh """
                            sed -i 's|image: ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:.*|image: ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}|' dev/deployment.yaml
                        """
                        
                        // Show updated image version
                        sh '''
                            echo "Updated image in dev/deployment.yaml:"
                            grep "image:" dev/deployment.yaml
                        '''
                        
                        // Commit and push changes
                        sh """
                            git add dev/deployment.yaml
                            git diff --cached
                            
                            # Only commit if there are changes
                            if git diff --cached --quiet; then
                                echo "No changes to commit"
                            else
                                git commit -m "Deploy ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} to dev"
                                
                                Build: #${BUILD_NUMBER}
                                Build URL: ${BUILD_URL}
                                
                                git push origin main
                                echo "Successfully pushed changes to manifest repository"
                            fi
                        """
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Pipeline completed successfully!"
            echo "Image: ${DOCKER_IMAGE_FULL_NAME}"
            echo "Manifest updated: dev/deployment.yaml"
        }
        failure {
            echo "❌ Pipeline failed!"
            // Stop test container if it's still running
            sh 'docker stop backend-api-test || true'
        }
        always {
            echo 'Cleaning up Docker images...'
            sh "docker rmi ${DOCKER_IMAGE_FULL_NAME} || true"
        }
    }
}