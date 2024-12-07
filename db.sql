-- db.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;

-- Clean up existing tables if they exist
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS parking_spots;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users CASCADE;

-- Create roles table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create user_roles junction table
CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- Create parking_spots table
CREATE TABLE parking_spots (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    image_url TEXT[],
    hourly_rate DECIMAL(10, 2) NOT NULL,
    daily_rate DECIMAL(10, 2),
    weekly_rate DECIMAL(10, 2),
    monthly_rate DECIMAL(10, 2),
    description TEXT,
    amenities TEXT[],
    rules TEXT[],
    is_available BOOLEAN DEFAULT TRUE,
    availability_schedule JSONB,
    size_type VARCHAR(50), -- compact, standard, large, etc.
    security_features TEXT[],
    is_covered BOOLEAN DEFAULT FALSE,
    is_24_7 BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on parking spots location for faster lookups
CREATE INDEX IF NOT EXISTS idx_parking_spots_location ON parking_spots(latitude, longitude);

-- Create index on parking spots owner for faster lookups
CREATE INDEX IF NOT EXISTS idx_parking_spots_owner ON parking_spots(owner_id);

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_parking_spots_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_parking_spots_updated_at
    BEFORE UPDATE ON parking_spots
    FOR EACH ROW
    EXECUTE FUNCTION update_parking_spots_updated_at_column();

-- Create bookings table
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    spot_id BIGINT REFERENCES parking_spots(id) ON DELETE SET NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'in_progress')),
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    cancellation_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on bookings spot for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_spot ON bookings(spot_id);

-- Create index on bookings user for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);

-- Create index on bookings status for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_bookings_updated_at_column();

-- Create reviews table
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    spot_id BIGINT REFERENCES parking_spots(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    comment TEXT,
    response TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on reviews spot for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_spot ON reviews(spot_id);

-- Create index on reviews rating for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_reviews_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_reviews_updated_at_column();

-- Create refresh_tokens table
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name) VALUES
    ('admin'),
    ('owner'),
    ('user')
ON CONFLICT (name) DO NOTHING;

-- Create views
CREATE OR REPLACE VIEW booking_details AS
SELECT 
    b.id as booking_id,
    b.start_time,
    b.end_time,
    b.total_price,
    b.status,
    b.payment_status,
    ps.name as spot_name,
    ps.address,
    ps.city,
    ps.state,
    u.name as user_name,
    u.email as user_email
FROM bookings b
JOIN parking_spots ps ON b.spot_id = ps.id
JOIN users u ON b.user_id = u.id;

-- Create function to calculate average rating
CREATE OR REPLACE FUNCTION calculate_avg_rating(spot_uuid BIGINT)
RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        SELECT ROUND(AVG(
            (rating + cleanliness_rating + safety_rating + value_rating) / 4.0
        )::numeric, 2)
        FROM reviews
        WHERE spot_id = spot_uuid
    );
END;
$$ LANGUAGE plpgsql;