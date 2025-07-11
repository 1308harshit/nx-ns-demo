const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { exec } = require('child_process');
const EmailService = require('./EmailService');
const EmailProvider = require('./EmailProvider');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Initialize email service
const provider1 = new EmailProvider('Provider1');
const provider2 = new EmailProvider('Provider2');
const emailService = new EmailService([provider1, provider2]);

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Email Service'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Email Service API',
        version: '1.0.0',
        endpoints: {
            'GET /health': 'Health check',
            'POST /send-email': 'Send an email',
            'GET /status': 'Get service status',
            'GET /test-results': 'Get test results',
            'POST /run-tests': 'Run tests and get results'
        }
    });
});

// Test results endpoint
app.get('/test-results', (req, res) => {
    exec('npm test -- --silent --verbose=false', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
                stderr: stderr
            });
        }
        
        // Parse the test output to extract key information
        const lines = stdout.split('\n');
        const summary = {
            success: !error,
            timestamp: new Date().toISOString(),
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            testResults: []
        };

        // Extract test results from output
        lines.forEach(line => {
            if (line.includes('PASS') || line.includes('✓')) {
                summary.passedTests++;
                summary.totalTests++;
                summary.testResults.push({
                    status: 'PASS',
                    test: line.replace(/PASS|✓/g, '').trim()
                });
            } else if (line.includes('FAIL') || line.includes('✕')) {
                summary.failedTests++;
                summary.totalTests++;
                summary.testResults.push({
                    status: 'FAIL',
                    test: line.replace(/FAIL|✕/g, '').trim()
                });
            }
        });

        // Add overall summary
        summary.message = error ? 'Tests failed' : 'All tests passed';
        summary.passRate = summary.totalTests > 0 ? ((summary.passedTests / summary.totalTests) * 100).toFixed(1) + '%' : '0%';

        res.json(summary);
    });
});

// Run tests endpoint
app.post('/run-tests', (req, res) => {
    exec('npm test', (error, stdout, stderr) => {
        res.json({
            success: !error,
            message: error ? 'Tests failed' : 'Tests passed',
            stdout: stdout,
            stderr: stderr,
            exitCode: error ? error.code : 0
        });
    });
});

// Send email endpoint
app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, body, id } = req.body;
        
        if (!to || !subject || !body) {
            return res.status(400).json({
                error: 'Missing required fields: to, subject, body'
            });
        }

        const email = {
            id: id || `email-${Date.now()}`,
            to,
            subject,
            body
        };

        const result = await emailService.send(email);
        
        res.status(200).json({
            success: true,
            message: 'Email queued for sending',
            emailId: email.id,
            status: result
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get service status endpoint
app.get('/status', (req, res) => {
    res.json({
        serviceStatus: emailService.status,
        providerFailures: Object.fromEntries(emailService.providerFailures),
        circuitBreakerStatus: Object.fromEntries(emailService.providerCircuitStatus),
        queueLength: emailService.queue.length,
        sentEmailsCount: emailService.sentEmails.size
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Email Service running on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/health`);
});

module.exports = app; 