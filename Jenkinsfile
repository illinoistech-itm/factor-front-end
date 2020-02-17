pipeline {
    agent {
        docker { image 'node:10-alpine' }
    }
    triggers{ cron('H/15 H(9-16) * * 1-5') }
    stages {
        stage ('checkout'){
          steps{
            checkout scm
          }
        }
        stage('Test/Coverage') {
            steps {
                sh 'RUN npm run-script test'
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'coverage', reportFiles: 'index.html', reportName: 'HTML Cov Report', reportTitles: ''])
            }
        }
        stage('Build') {
            steps {
                sh 'RUN npm run-script build:i18n --prod --build-optimizer'
            }
        }
        stage('deploy') {
            steps {
                sh 'echo future.'
            }
        }
    }
    post {
        always {
            junit "test-results.xml"
        }
    }
}