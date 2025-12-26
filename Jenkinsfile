pipeline {
    agent any
    environment {
        DOCKER_REGISTRY  = "localhost:5000"
        DOCKER_IMAGE_NAME = "backend-api"
        DOCKER_IMAGE_TAG = "${env.BUILD_NUMBER}"
        DOCKER_IMAGE_FULL_NAME = "${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"

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
                sh 'docker build -t ${DOCKER_IMAGE_FULL_NAME} .'
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
                sh 'docker rm backend-api-test'
                sh 'docker rmi -f ${DOCKER_IMAGE_FULL_NAME}'
            }
        }
    }
}