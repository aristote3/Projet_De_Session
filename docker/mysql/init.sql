-- ============================================
-- YouManage - MySQL Initialization Script
-- ============================================

-- Grant privileges
GRANT ALL PRIVILEGES ON youmanage.* TO 'youmanage'@'%';
FLUSH PRIVILEGES;

-- Use database
USE youmanage;

-- Log initialization
SELECT 'YouManage database initialized successfully!' as message;

