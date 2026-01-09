pipeline {
    agent any
    environment {
        DOCKER_REGISTRY  = "192.168.49.1:5000"
        DOCKER_IMAGE_NAME = "backend-api"
        DOCKER_IMAGE_TAG = "${env.BUILD_NUMBER}"
        DOCKER_IMAGE_FULL_NAME = "${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
        MANIFEST_REPO = "git@github.com:priyen15/CICD-project-k8s.git"

        GITHUB_CREDENTIALS = 'ssh-key'
        GITHUB_USERNAME = 'priyen15'
        GITHUB_EMAIL = 'priyenpatel122@gmail.com'
    }
    stages {
        stage('check out') {
            steps {
                echo 'Checking out the repository'
                checkout scm
            }
        }
        stage('image build') {
            steps {
                echo 'Building the image'
                sh 'docker build --pull -t ${DOCKER_IMAGE_FULL_NAME} .'
            }
        }
        
        stage('image test') {
            steps {
                echo 'Testing the built Docker image'
                // Run the container in detached mode, mapping port 3000
                sh 'docker run -d --rm --name backend-api-test -p 3000:3000 ${DOCKER_IMAGE_FULL_NAME}'
                
                // Health check: wait a bit for the container to come up, then curl the health endpoint
                sh '''
                  sleep 5
                  curl --fail http://localhost:3000/health
                '''
                
                // Optional: Test a main API endpoint as well
                sh 'curl --fail http://localhost:3000/api'
                
                // Stop the test container
                sh 'docker stop backend-api-test'
            }
        }

        stage('image push') {
            steps {
                echo 'Pushing the image to the registry'
                sh 'docker push ${DOCKER_IMAGE_FULL_NAME}'
            }
        }

        stage('container and image cleanup') {
            steps {
                echo 'Cleaning up the container and image'
                sh 'docker rmi -f ${DOCKER_IMAGE_FULL_NAME}'
            }
        }

        stage('Update Manifest Repo') {
            steps {
                echo 'Updating the manifest repository'
                sshagent(credentials: [${GITHUB_CREDENTIALS}]) {
                    dir('manifest-repo') {
                        sh '''
                            git clone ${MANIFEST_REPO}
                        '''

                        sh '''
                            git config user.name "${GITHUB_USERNAME}"
                            git config user.email "${GITHUB_EMAIL}"
                        '''

                        script{
                            // Method 1: Using sed (simple replacement)
                            sh '''
                                sed -i 's|image: ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:.*|image: ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}|' dev/deployment.yaml
                            '''

                            // Commit and push
                            sh '''
                                git add dev/deployment.yaml
                                git diff --cached
                                git commit -m "Deploy ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} to dev" || echo "No changes"
                                git push origin main
                            '''
                        }
                    }
                }
            }
        }
    }
}