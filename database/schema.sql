-- DAORS Flow Motion Database Schema
-- This file contains the complete database schema for the DAORS Flow Motion application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CLIENT' CHECK (role IN ('ADMIN', 'MANAGER', 'DRIVER', 'CLIENT')),
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    associated_item_ids TEXT[], -- Array of item IDs that this user can access
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table (shipments/packages)
CREATE TABLE IF NOT EXISTS public.items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    location VARCHAR(255),
    coordinates JSONB, -- {lat: number, lng: number}
    history JSONB DEFAULT '[]'::jsonb, -- Array of {status: string, timestamp: string}
    documents JSONB DEFAULT '[]'::jsonb, -- Array of {name: string, url: string}
    route_id UUID,
    predicted_eta JSONB, -- {time: string, confidence: number}
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Routes table (delivery routes)
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'planned',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    eta TIMESTAMP WITH TIME ZONE,
    driver VARCHAR(255),
    predicted_eta JSONB, -- {time: string, confidence: number}
    current_position JSONB, -- {lat: number, lng: number}
    speed DECIMAL(5,2) DEFAULT 0, -- km/h
    last_moved TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    planned_route JSONB DEFAULT '[]'::jsonb, -- Array of {lat: number, lng: number}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Anomalies table
CREATE TABLE IF NOT EXISTS public.anomalies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('UNSCHEDULED_STOP', 'ROUTE_DEVIATION', 'SPEED_ANOMALY', 'TEMPERATURE_BREACH')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    description TEXT NOT NULL,
    vehicle_id VARCHAR(100),
    route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('anomaly', 'status_change', 'system_message')),
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE,
    related_id UUID, -- Can reference items, routes, etc.
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shipment_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for items.route_id
ALTER TABLE public.items 
ADD CONSTRAINT fk_items_route_id 
FOREIGN KEY (route_id) REFERENCES public.routes(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_route_id ON public.items(route_id);
CREATE INDEX IF NOT EXISTS idx_routes_status ON public.routes(status);
CREATE INDEX IF NOT EXISTS idx_anomalies_route_id ON public.anomalies(route_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_timestamp ON public.anomalies(timestamp);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_chat_messages_shipment_id ON public.chat_messages(shipment_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON public.routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();