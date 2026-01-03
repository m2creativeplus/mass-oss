-- Complete MASS Car Workshop Database Setup
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table (for authentication)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'staff', 'technician', 'customer')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50) DEFAULT 'Hargeisa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    vin VARCHAR(17) UNIQUE,
    license_plate VARCHAR(20),
    color VARCHAR(30),
    mileage INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50) DEFAULT 'Hargeisa',
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parts catalog table
CREATE TABLE IF NOT EXISTS public.parts_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_number VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    supplier_id UUID REFERENCES public.suppliers(id),
    cost_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create labor guide table
CREATE TABLE IF NOT EXISTS public.labor_guide (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_code VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50),
    standard_hours DECIMAL(4,2) NOT NULL,
    suggested_rate DECIMAL(8,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspection templates table
CREATE TABLE IF NOT EXISTS public.inspection_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspection template items table
CREATE TABLE IF NOT EXISTS public.inspection_template_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES public.inspection_templates(id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT false
);

-- Create inspections table
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES public.user_profiles(id),
    template_id UUID REFERENCES public.inspection_templates(id),
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('draft', 'in_progress', 'completed', 'approved')),
    mileage INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create inspection items table
CREATE TABLE IF NOT EXISTS public.inspection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'ok' CHECK (status IN ('ok', 'attention', 'immediate_attention')),
    notes TEXT,
    photo_url TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Create estimates table
CREATE TABLE IF NOT EXISTS public.estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    inspection_id UUID REFERENCES public.inspections(id),
    estimate_number VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'approved', 'declined', 'expired')),
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create estimate line items table
CREATE TABLE IF NOT EXISTS public.estimate_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_id UUID REFERENCES public.estimates(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('part', 'labor', 'service')),
    description TEXT NOT NULL,
    quantity DECIMAL(8,2) DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    part_id UUID REFERENCES public.parts_catalog(id),
    labor_id UUID REFERENCES public.labor_guide(id),
    is_approved BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES public.user_profiles(id),
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    service_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_guide ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Customers policies
CREATE POLICY "Staff can manage customers" ON public.customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Vehicles policies  
CREATE POLICY "Staff can manage vehicles" ON public.vehicles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff', 'technician')
        )
    );

-- Suppliers policies
CREATE POLICY "Staff can manage suppliers" ON public.suppliers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Parts catalog policies
CREATE POLICY "All can view parts" ON public.parts_catalog
    FOR SELECT USING (true);

CREATE POLICY "Staff can insert parts" ON public.parts_catalog
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Staff can update parts" ON public.parts_catalog
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Staff can delete parts" ON public.parts_catalog
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Labor guide policies
CREATE POLICY "All can view labor guide" ON public.labor_guide
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert labor guide" ON public.labor_guide
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update labor guide" ON public.labor_guide
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete labor guide" ON public.labor_guide
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Inspection templates policies
CREATE POLICY "All can view inspection templates" ON public.inspection_templates
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert inspection templates" ON public.inspection_templates
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update inspection templates" ON public.inspection_templates
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete inspection templates" ON public.inspection_templates
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, first_name, last_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.customers (first_name, last_name, email, phone, address, city) VALUES
('Ahmed', 'Hassan', 'ahmed.hassan@email.com', '+252-63-123-4567', 'Jigiga Yar District', 'Hargeisa'),
('Fatima', 'Ali', 'fatima.ali@email.com', '+252-63-234-5678', 'Ahmed Dhagah District', 'Hargeisa'),
('Mohamed', 'Omar', 'mohamed.omar@email.com', '+252-63-345-6789', 'Mohamoud Haibe District', 'Hargeisa'),
('Sahra', 'Abdi', 'sahra.abdi@email.com', '+252-63-456-7890', 'Ibrahim Kodbuur District', 'Hargeisa')
ON CONFLICT (email) DO NOTHING;

-- Insert sample suppliers
INSERT INTO public.suppliers (name, contact_person, email, phone, address, city, category) VALUES
('Hargeisa Auto Parts', 'Abdi Mohamed', 'info@hargeiasautoparts.com', '+252-63-111-2222', 'Main Market Street', 'Hargeisa', 'Parts'),
('Somaliland Motors', 'Khadija Hassan', 'sales@somalilandmotors.com', '+252-63-333-4444', 'Industrial Area', 'Hargeisa', 'Parts & Service'),
('Al-Baraka Spare Parts', 'Omar Ali', 'contact@albaraka.com', '+252-63-555-6666', 'New Market', 'Hargeisa', 'Parts'),
('Horn Auto Supply', 'Amina Jama', 'orders@hornautosupply.com', '+252-63-777-8888', 'Commercial District', 'Hargeisa', 'Parts & Tools');

-- Insert sample parts
INSERT INTO public.parts_catalog (part_number, name, description, category, cost_price, selling_price, stock_quantity) VALUES
('ENG001', 'Engine Oil Filter', 'Standard oil filter for most vehicles', 'Engine', 5.00, 8.00, 50),
('BRK001', 'Brake Pads Set', 'Front brake pads - ceramic', 'Brakes', 25.00, 40.00, 20),
('TIR001', 'All-Season Tire', '195/65R15 All-Season Tire', 'Tires', 45.00, 70.00, 16),
('BAT001', 'Car Battery', '12V 60Ah Car Battery', 'Electrical', 80.00, 120.00, 8);

-- Insert sample labor operations
INSERT INTO public.labor_guide (operation_code, description, category, standard_hours, suggested_rate) VALUES
('OIL001', 'Oil Change Service', 'Maintenance', 0.5, 25.00),
('BRK001', 'Brake Pad Replacement', 'Brakes', 1.5, 75.00),
('TIR001', 'Tire Installation (4 tires)', 'Tires', 1.0, 50.00),
('INS001', 'Vehicle Inspection', 'Inspection', 1.0, 60.00);

-- Insert sample inspection template
INSERT INTO public.inspection_templates (name, description, category) VALUES
('Standard Vehicle Inspection', 'Comprehensive vehicle safety and maintenance inspection', 'General')
ON CONFLICT DO NOTHING;

-- Insert inspection template items
DO $$
DECLARE
    template_uuid UUID;
BEGIN
    SELECT id INTO template_uuid FROM public.inspection_templates WHERE name = 'Standard Vehicle Inspection' LIMIT 1;
    
    IF template_uuid IS NOT NULL THEN
        INSERT INTO public.inspection_template_items (template_id, item_name, category, sort_order) VALUES
        (template_uuid, 'Engine Oil Level', 'Engine', 1),
        (template_uuid, 'Brake Fluid Level', 'Brakes', 2),
        (template_uuid, 'Tire Condition', 'Tires', 3),
        (template_uuid, 'Battery Condition', 'Electrical', 4),
        (template_uuid, 'Lights Operation', 'Electrical', 5),
        (template_uuid, 'Windshield Condition', 'Body', 6)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
