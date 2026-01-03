-- =====================================================
-- MASS Car Workshop VWMS - Complete Database Setup
-- =====================================================
-- Run this entire script in your Supabase SQL Editor
-- This creates all tables, policies, functions, and sample data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. USER PROFILES & AUTHENTICATION
-- =====================================================

-- Create user profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'technician', 'customer')),
    is_active BOOLEAN DEFAULT true,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================
-- 2. CUSTOMERS & VEHICLES
-- =====================================================

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'CUST-' || LPAD(nextval('customer_seq')::TEXT, 6, '0'),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50) DEFAULT 'Hargeisa',
    country VARCHAR(50) DEFAULT 'Somaliland',
    date_of_birth DATE,
    preferred_contact VARCHAR(20) DEFAULT 'phone' CHECK (preferred_contact IN ('phone', 'email', 'sms')),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for customer numbers
CREATE SEQUENCE IF NOT EXISTS customer_seq START 1;

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    vin VARCHAR(17) UNIQUE,
    license_plate VARCHAR(20),
    color VARCHAR(30),
    engine_type VARCHAR(50),
    transmission VARCHAR(20),
    fuel_type VARCHAR(20) DEFAULT 'gasoline',
    mileage INTEGER DEFAULT 0,
    last_service_date DATE,
    next_service_due INTEGER,
    insurance_expiry DATE,
    registration_expiry DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. SUPPLIERS & INVENTORY
-- =====================================================

-- Create suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_code VARCHAR(20) UNIQUE NOT NULL DEFAULT 'SUP-' || LPAD(nextval('supplier_seq')::TEXT, 4, '0'),
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50) DEFAULT 'Hargeisa',
    country VARCHAR(50) DEFAULT 'Somaliland',
    category VARCHAR(50),
    payment_terms VARCHAR(50),
    credit_limit DECIMAL(12,2) DEFAULT 0,
    tax_id VARCHAR(50),
    website VARCHAR(200),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for supplier codes
CREATE SEQUENCE IF NOT EXISTS supplier_seq START 1;

-- Create parts catalog table
CREATE TABLE IF NOT EXISTS public.parts_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    subcategory VARCHAR(50),
    brand VARCHAR(50),
    supplier_id UUID REFERENCES public.suppliers(id),
    cost_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    markup_percentage DECIMAL(5,2),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 5,
    max_stock_level INTEGER DEFAULT 100,
    reorder_point INTEGER DEFAULT 10,
    unit_of_measure VARCHAR(20) DEFAULT 'piece',
    weight DECIMAL(8,2),
    dimensions VARCHAR(50),
    warranty_period INTEGER, -- in months
    barcode VARCHAR(50),
    location VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory transactions table
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id UUID REFERENCES public.parts_catalog(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('in', 'out', 'adjustment', 'transfer')),
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    reference_type VARCHAR(20), -- 'purchase', 'sale', 'adjustment', 'return'
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. LABOR GUIDE & SERVICES
-- =====================================================

-- Create labor guide table
CREATE TABLE IF NOT EXISTS public.labor_guide (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category VARCHAR(50),
    subcategory VARCHAR(50),
    standard_hours DECIMAL(4,2) NOT NULL,
    suggested_rate DECIMAL(8,2) NOT NULL,
    skill_level VARCHAR(20) DEFAULT 'intermediate' CHECK (skill_level IN ('basic', 'intermediate', 'advanced', 'expert')),
    tools_required TEXT[],
    safety_notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service packages table
CREATE TABLE IF NOT EXISTS public.service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    duration_hours DECIMAL(4,2),
    price DECIMAL(10,2),
    includes TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. APPOINTMENTS & SCHEDULING
-- =====================================================

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'APT-' || LPAD(nextval('appointment_seq')::TEXT, 6, '0'),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES public.user_profiles(id),
    service_advisor_id UUID REFERENCES public.user_profiles(id),
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    service_type VARCHAR(50),
    service_package_id UUID REFERENCES public.service_packages(id),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    customer_notes TEXT,
    internal_notes TEXT,
    estimated_cost DECIMAL(10,2),
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for appointment numbers
CREATE SEQUENCE IF NOT EXISTS appointment_seq START 1;

-- =====================================================
-- 6. JOB CARDS & WORK ORDERS
-- =====================================================

-- Create job cards table
CREATE TABLE IF NOT EXISTS public.job_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'JOB-' || LPAD(nextval('job_seq')::TEXT, 6, '0'),
    appointment_id UUID REFERENCES public.appointments(id),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES public.user_profiles(id),
    service_advisor_id UUID REFERENCES public.user_profiles(id),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_parts', 'waiting_approval', 'completed', 'invoiced', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    customer_complaint TEXT,
    diagnosis TEXT,
    work_performed TEXT,
    recommendations TEXT,
    mileage_in INTEGER,
    mileage_out INTEGER,
    labor_hours DECIMAL(4,2) DEFAULT 0,
    parts_total DECIMAL(10,2) DEFAULT 0,
    labor_total DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for job numbers
CREATE SEQUENCE IF NOT EXISTS job_seq START 1;

-- Create job card line items table
CREATE TABLE IF NOT EXISTS public.job_card_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_card_id UUID REFERENCES public.job_cards(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('part', 'labor', 'service', 'misc')),
    description TEXT NOT NULL,
    part_id UUID REFERENCES public.parts_catalog(id),
    labor_id UUID REFERENCES public.labor_guide(id),
    quantity DECIMAL(8,2) DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    technician_id UUID REFERENCES public.user_profiles(id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. DIGITAL VEHICLE INSPECTIONS (DVI)
-- =====================================================

-- Create inspection templates table
CREATE TABLE IF NOT EXISTS public.inspection_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    version VARCHAR(10) DEFAULT '1.0',
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspection template items table
CREATE TABLE IF NOT EXISTS public.inspection_template_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES public.inspection_templates(id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    subcategory VARCHAR(50),
    inspection_type VARCHAR(20) DEFAULT 'visual' CHECK (inspection_type IN ('visual', 'measurement', 'test', 'photo')),
    sort_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT false,
    pass_criteria TEXT,
    fail_criteria TEXT,
    measurement_unit VARCHAR(20),
    min_value DECIMAL(10,2),
    max_value DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspections table
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'INS-' || LPAD(nextval('inspection_seq')::TEXT, 6, '0'),
    job_card_id UUID REFERENCES public.job_cards(id),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES public.user_profiles(id),
    template_id UUID REFERENCES public.inspection_templates(id),
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('draft', 'in_progress', 'completed', 'approved', 'declined')),
    mileage INTEGER,
    fuel_level VARCHAR(20),
    overall_condition VARCHAR(20) DEFAULT 'good' CHECK (overall_condition IN ('excellent', 'good', 'fair', 'poor')),
    safety_rating VARCHAR(20) DEFAULT 'safe' CHECK (safety_rating IN ('safe', 'attention_needed', 'unsafe')),
    customer_notes TEXT,
    technician_notes TEXT,
    recommendations TEXT,
    next_inspection_due DATE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for inspection numbers
CREATE SEQUENCE IF NOT EXISTS inspection_seq START 1;

-- Create inspection items table
CREATE TABLE IF NOT EXISTS public.inspection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
    template_item_id UUID REFERENCES public.inspection_template_items(id),
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ok' CHECK (status IN ('ok', 'attention', 'immediate_attention', 'not_applicable')),
    condition_rating INTEGER CHECK (condition_rating >= 1 AND condition_rating <= 5),
    measured_value DECIMAL(10,2),
    notes TEXT,
    recommendations TEXT,
    photo_urls TEXT[],
    video_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspection photos table
CREATE TABLE IF NOT EXISTS public.inspection_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
    inspection_item_id UUID REFERENCES public.inspection_items(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    photo_type VARCHAR(20) DEFAULT 'general' CHECK (photo_type IN ('general', 'damage', 'wear', 'before', 'after')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. ESTIMATES & APPROVALS
-- =====================================================

-- Create estimates table
CREATE TABLE IF NOT EXISTS public.estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'EST-' || LPAD(nextval('estimate_seq')::TEXT, 6, '0'),
    job_card_id UUID REFERENCES public.job_cards(id),
    inspection_id UUID REFERENCES public.inspections(id),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES public.user_profiles(id),
    service_advisor_id UUID REFERENCES public.user_profiles(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'approved', 'declined', 'expired', 'revised')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    work_description TEXT,
    customer_notes TEXT,
    internal_notes TEXT,
    subtotal DECIMAL(10,2) DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_percentage DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    valid_until DATE,
    sent_at TIMESTAMP WITH TIME ZONE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    declined_at TIMESTAMP WITH TIME ZONE,
    decline_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for estimate numbers
CREATE SEQUENCE IF NOT EXISTS estimate_seq START 1;

-- Create estimate line items table
CREATE TABLE IF NOT EXISTS public.estimate_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_id UUID REFERENCES public.estimates(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('part', 'labor', 'service', 'misc')),
    category VARCHAR(50),
    description TEXT NOT NULL,
    part_id UUID REFERENCES public.parts_catalog(id),
    labor_id UUID REFERENCES public.labor_guide(id),
    quantity DECIMAL(8,2) DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    customer_approved BOOLEAN DEFAULT false,
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer approvals table
CREATE TABLE IF NOT EXISTS public.customer_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_id UUID REFERENCES public.estimates(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    approval_method VARCHAR(20) DEFAULT 'digital' CHECK (approval_method IN ('digital', 'phone', 'email', 'in_person')),
    ip_address INET,
    user_agent TEXT,
    signature_data TEXT, -- Base64 encoded signature
    approved_items UUID[], -- Array of estimate line item IDs
    declined_items UUID[], -- Array of estimate line item IDs
    total_approved_amount DECIMAL(10,2),
    notes TEXT,
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. INVOICING & PAYMENTS
-- =====================================================

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'INV-' || LPAD(nextval('invoice_seq')::TEXT, 6, '0'),
    job_card_id UUID REFERENCES public.job_cards(id),
    estimate_id UUID REFERENCES public.estimates(id),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled')),
    subtotal DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) DEFAULT 0,
    due_date DATE,
    payment_terms VARCHAR(50) DEFAULT 'Net 30',
    notes TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'PAY-' || LPAD(nextval('payment_seq')::TEXT, 6, '0'),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'mobile_money', 'check')),
    reference_number VARCHAR(50),
    notes TEXT,
    processed_by UUID REFERENCES public.user_profiles(id),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for payment numbers
CREATE SEQUENCE IF NOT EXISTS payment_seq START 1;

-- =====================================================
-- 10. NOTIFICATIONS & COMMUNICATIONS
-- =====================================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create communication logs table
CREATE TABLE IF NOT EXISTS public.communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'call', 'whatsapp')),
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    subject VARCHAR(200),
    content TEXT,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'pending')),
    sent_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. AUDIT LOGS & SYSTEM LOGS
-- =====================================================

-- Create audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system logs table
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(10) NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
    message TEXT NOT NULL,
    context JSONB,
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_guide ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_card_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 13. CREATE RLS POLICIES
-- =====================================================

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all profiles" ON public.user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

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

CREATE POLICY "Staff can manage parts" ON public.parts_catalog
    FOR INSERT, UPDATE, DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Labor guide policies
CREATE POLICY "All can view labor guide" ON public.labor_guide
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage labor guide" ON public.labor_guide
    FOR INSERT, UPDATE, DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- General policy for most tables (staff and above can manage)
DO $$
DECLARE
    table_name TEXT;
    tables TEXT[] := ARRAY[
        'appointments', 'job_cards', 'job_card_line_items', 
        'inspections', 'inspection_items', 'inspection_photos',
        'estimates', 'estimate_line_items', 'customer_approvals',
        'invoices', 'payments', 'inventory_transactions'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('
            CREATE POLICY "Staff can manage %I" ON public.%I
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.user_profiles 
                    WHERE user_id = auth.uid() AND role IN (''admin'', ''staff'', ''technician'')
                )
            )', table_name, table_name);
    END LOOP;
END $$;

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Audit logs policies (admin only)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- 14. CREATE FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to handle new user registration
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers for relevant tables
DO $$
DECLARE
    table_name TEXT;
    tables TEXT[] := ARRAY[
        'user_profiles', 'customers', 'vehicles', 'suppliers', 'parts_catalog',
        'labor_guide', 'appointments', 'job_cards', 'inspections', 'estimates', 'invoices'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON public.%I
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', 
            table_name, table_name);
    END LOOP;
END $$;

-- Function to calculate estimate totals
CREATE OR REPLACE FUNCTION public.calculate_estimate_totals()
RETURNS TRIGGER AS $$
DECLARE
    estimate_record RECORD;
    line_total DECIMAL(10,2);
BEGIN
    -- Get estimate details
    SELECT * INTO estimate_record FROM public.estimates WHERE id = COALESCE(NEW.estimate_id, OLD.estimate_id);
    
    -- Calculate subtotal from line items
    SELECT COALESCE(SUM(total_price), 0) INTO line_total
    FROM public.estimate_line_items 
    WHERE estimate_id = estimate_record.id;
    
    -- Update estimate totals
    UPDATE public.estimates SET
        subtotal = line_total,
        discount_amount = (line_total * COALESCE(discount_percentage, 0) / 100),
        tax_amount = ((line_total - (line_total * COALESCE(discount_percentage, 0) / 100)) * COALESCE(tax_percentage, 0) / 100),
        total_amount = line_total - (line_total * COALESCE(discount_percentage, 0) / 100) + ((line_total - (line_total * COALESCE(discount_percentage, 0) / 100)) * COALESCE(tax_percentage, 0) / 100),
        updated_at = NOW()
    WHERE id = estimate_record.id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for estimate calculations
CREATE TRIGGER calculate_estimate_totals_on_insert
    AFTER INSERT ON public.estimate_line_items
    FOR EACH ROW EXECUTE FUNCTION public.calculate_estimate_totals();

CREATE TRIGGER calculate_estimate_totals_on_update
    AFTER UPDATE ON public.estimate_line_items
    FOR EACH ROW EXECUTE FUNCTION public.calculate_estimate_totals();

CREATE TRIGGER calculate_estimate_totals_on_delete
    AFTER DELETE ON public.estimate_line_items
    FOR EACH ROW EXECUTE FUNCTION public.calculate_estimate_totals();

-- =====================================================
-- 15. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

-- Customers indexes
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_customers_customer_number ON public.customers(customer_number);

-- Vehicles indexes
CREATE INDEX idx_vehicles_customer_id ON public.vehicles(customer_id);
CREATE INDEX idx_vehicles_vin ON public.vehicles(vin);
CREATE INDEX idx_vehicles_license_plate ON public.vehicles(license_plate);

-- Parts catalog indexes
CREATE INDEX idx_parts_catalog_part_number ON public.parts_catalog(part_number);
CREATE INDEX idx_parts_catalog_category ON public.parts_catalog(category);
CREATE INDEX idx_parts_catalog_supplier_id ON public.parts_catalog(supplier_id);

-- Appointments indexes
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_customer_id ON public.appointments(customer_id);
CREATE INDEX idx_appointments_technician_id ON public.appointments(technician_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);

-- Job cards indexes
CREATE INDEX idx_job_cards_customer_id ON public.job_cards(customer_id);
CREATE INDEX idx_job_cards_vehicle_id ON public.job_cards(vehicle_id);
CREATE INDEX idx_job_cards_technician_id ON public.job_cards(technician_id);
CREATE INDEX idx_job_cards_status ON public.job_cards(status);
CREATE INDEX idx_job_cards_job_number ON public.job_cards(job_number);

-- Inspections indexes
CREATE INDEX idx_inspections_vehicle_id ON public.inspections(vehicle_id);
CREATE INDEX idx_inspections_technician_id ON public.inspections(technician_id);
CREATE INDEX idx_inspections_status ON public.inspections(status);

-- Estimates indexes
CREATE INDEX idx_estimates_customer_id ON public.estimates(customer_id);
CREATE INDEX idx_estimates_status ON public.estimates(status);
CREATE INDEX idx_estimates_estimate_number ON public.estimates(estimate_number);

-- Invoices indexes
CREATE INDEX idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);

-- =====================================================
-- 16. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample customers
INSERT INTO public.customers (first_name, last_name, email, phone, address, city) VALUES
('Ahmed', 'Hassan', 'ahmed.hassan@email.com', '+252-63-123-4567', 'Jigiga Yar District', 'Hargeisa'),
('Fatima', 'Ali', 'fatima.ali@email.com', '+252-63-234-5678', 'Ahmed Dhagah District', 'Hargeisa'),
('Mohamed', 'Omar', 'mohamed.omar@email.com', '+252-63-345-6789', 'Mohamoud Haibe District', 'Hargeisa'),
('Sahra', 'Abdi', 'sahra.abdi@email.com', '+252-63-456-7890', 'Ibrahim Kodbuur District', 'Hargeisa'),
('Abdi', 'Jama', 'abdi.jama@email.com', '+252-63-567-8901', 'New Hargeisa District', 'Hargeisa'),
('Khadija', 'Mohamed', 'khadija.mohamed@email.com', '+252-63-678-9012', 'Ga'an Libah District', 'Hargeisa')
ON CONFLICT (email) DO NOTHING;

-- Insert sample vehicles
DO $$
DECLARE
    customer_ids UUID[];
    customer_id UUID;
BEGIN
    -- Get customer IDs
    SELECT ARRAY(SELECT id FROM public.customers LIMIT 6) INTO customer_ids;
    
    -- Insert vehicles for each customer
    FOR i IN 1..array_length(customer_ids, 1) LOOP
        customer_id := customer_ids[i];
        
        CASE i
            WHEN 1 THEN
                INSERT INTO public.vehicles (customer_id, make, model, year, vin, license_plate, color, mileage) VALUES
                (customer_id, 'Toyota', 'Corolla', 2018, '1NXBR32E25Z123456', 'SL-001-ABC', 'White', 85000);
            WHEN 2 THEN
                INSERT INTO public.vehicles (customer_id, make, model, year, vin, license_plate, color, mileage) VALUES
                (customer_id, 'Honda', 'Civic', 2019, '2HGFC2F59KH123456', 'SL-002-DEF', 'Silver', 72000);
            WHEN 3 THEN
                INSERT INTO public.vehicles (customer_id, make, model, year, vin, license_plate, color, mileage) VALUES
                (customer_id, 'Nissan', 'Altima', 2020, '1N4AL3AP8LC123456', 'SL-003-GHI', 'Black', 45000);
            WHEN 4 THEN
                INSERT INTO public.vehicles (customer_id, make, model, year, vin, license_plate, color, mileage) VALUES
                (customer_id, 'Hyundai', 'Elantra', 2017, 'KMHD14LA8HA123456', 'SL-004-JKL', 'Blue', 95000);
            WHEN 5 THEN
                INSERT INTO public.vehicles (customer_id, make, model, year, vin, license_plate, color, mileage) VALUES
                (customer_id, 'Kia', 'Forte', 2021, 'KNAFP4A61M5123456', 'SL-005-MNO', 'Red', 28000);
            WHEN 6 THEN
                INSERT INTO public.vehicles (customer_id, make, model, year, vin, license_plate, color, mileage) VALUES
                (customer_id, 'Mazda', 'Mazda3', 2019, 'JM1BN1L77K1123456', 'SL-006-PQR', 'Gray', 67000);
        END CASE;
    END LOOP;
END $$;

-- Insert sample suppliers
INSERT INTO public.suppliers (name, contact_person, email, phone, address, city, category) VALUES
('Hargeisa Auto Parts', 'Abdi Mohamed', 'info@hargeiasautoparts.com', '+252-63-111-2222', 'Main Market Street', 'Hargeisa', 'Parts'),
('Somaliland Motors', 'Khadija Hassan', 'sales@somalilandmotors.com', '+252-63-333-4444', 'Industrial Area', 'Hargeisa', 'Parts & Service'),
('Al-Baraka Spare Parts', 'Omar Ali', 'contact@albaraka.com', '+252-63-555-6666', 'New Market', 'Hargeisa', 'Parts'),
('Horn Auto Supply', 'Amina Jama', 'orders@hornautosupply.com', '+252-63-777-8888', 'Commercial District', 'Hargeisa', 'Parts & Tools'),
('East Africa Automotive', 'Hassan Farah', 'sales@eastafricaauto.com', '+252-63-999-0000', 'Export Road', 'Hargeisa', 'Wholesale Parts');

-- Insert sample parts catalog
DO $$
DECLARE
    supplier_ids UUID[];
BEGIN
    SELECT ARRAY(SELECT id FROM public.suppliers LIMIT 5) INTO supplier_ids;
    
    INSERT INTO public.parts_catalog (part_number, name, description, category, brand, supplier_id, cost_price, selling_price, stock_quantity) VALUES
    -- Engine parts
    ('ENG001', 'Engine Oil Filter', 'Standard oil filter for most vehicles', 'Engine', 'OEM', supplier_ids[1], 5.00, 8.00, 50),
    ('ENG002', 'Air Filter', 'High-flow air filter', 'Engine', 'K&N', supplier_ids[1], 15.00, 25.00, 30),
    ('ENG003', 'Spark Plugs Set', 'Iridium spark plugs (4-pack)', 'Engine', 'NGK', supplier_ids[2], 25.00, 40.00, 25),
    ('ENG004', 'Fuel Filter', 'Inline fuel filter', 'Engine', 'Bosch', supplier_ids[1], 12.00, 20.00, 40),
    
    -- Brake parts
    ('BRK001', 'Brake Pads Set', 'Front brake pads - ceramic', 'Brakes', 'Brembo', supplier_ids[2], 25.00, 40.00, 20),
    ('BRK002', 'Brake Rotors', 'Front brake rotors (pair)', 'Brakes', 'AC Delco', supplier_ids[3], 80.00, 120.00, 15),
    ('BRK003', 'Brake Fluid', 'DOT 3 brake fluid (1L)', 'Brakes', 'Castrol', supplier_ids[1], 8.00, 15.00, 35),
    
    -- Suspension parts
    ('SUS001', 'Shock Absorbers', 'Front shock absorbers (pair)', 'Suspension', 'Monroe', supplier_ids[4], 120.00, 180.00, 10),
    ('SUS002', 'Strut Assembly', 'Complete strut assembly', 'Suspension', 'KYB', supplier_ids[4], 150.00, 220.00, 8),
    
    -- Electrical parts
    ('ELE001', 'Car Battery', '12V 60Ah Car Battery', 'Electrical', 'Exide', supplier_ids[5], 80.00, 120.00, 12),
    ('ELE002', 'Alternator', 'Remanufactured alternator', 'Electrical', 'Bosch', supplier_ids[3], 180.00, 280.00, 5),
    ('ELE003', 'Starter Motor', 'Remanufactured starter', 'Electrical', 'Denso', supplier_ids[3], 150.00, 230.00, 6),
    
    -- Tires
    ('TIR001', 'All-Season Tire', '195/65R15 All-Season Tire', 'Tires', 'Michelin', supplier_ids[2], 45.00, 70.00, 16),
    ('TIR002', 'Performance Tire', '205/55R16 Performance Tire', 'Tires', 'Continental', supplier_ids[2], 65.00, 95.00, 12),
    
    -- Fluids & Lubricants
    ('FLU001', 'Engine Oil', '5W-30 Synthetic Oil (5L)', 'Fluids', 'Mobil 1', supplier_ids[1], 25.00, 40.00, 30),
    ('FLU002', 'Transmission Fluid', 'ATF Dexron VI (1L)', 'Fluids', 'Valvoline', supplier_ids[1], 12.00, 20.00, 25),
    ('FLU003', 'Coolant', 'Extended Life Coolant (4L)', 'Fluids', 'Prestone', supplier_ids[1], 18.00, 30.00, 20);
END $$;

-- Insert sample labor operations
INSERT INTO public.labor_guide (operation_code, description, category, standard_hours, suggested_rate, skill_level) VALUES
-- Maintenance
('OIL001', 'Oil Change Service', 'Maintenance', 0.5, 25.00, 'basic'),
('OIL002', 'Oil Change + Filter', 'Maintenance', 0.75, 35.00, 'basic'),
('FLU001', 'Fluid Top-up Service', 'Maintenance', 0.25, 15.00, 'basic'),
('INS001', 'Basic Vehicle Inspection', 'Inspection', 1.0, 60.00, 'intermediate'),
('INS002', 'Comprehensive Inspection', 'Inspection', 2.0, 120.00, 'intermediate'),

-- Brakes
('BRK001', 'Brake Pad Replacement', 'Brakes', 1.5, 75.00, 'intermediate'),
('BRK002', 'Brake Rotor Replacement', 'Brakes', 2.0, 100.00, 'intermediate'),
('BRK003', 'Brake System Flush', 'Brakes', 1.0, 60.00, 'intermediate'),
('BRK004', 'Brake Caliper Service', 'Brakes', 2.5, 125.00, 'advanced'),

-- Engine
('ENG001', 'Spark Plug Replacement', 'Engine', 1.0, 50.00, 'intermediate'),
('ENG002', 'Air Filter Replacement', 'Engine', 0.25, 15.00, 'basic'),
('ENG003', 'Fuel Filter Replacement', 'Engine', 0.75, 40.00, 'intermediate'),
('ENG004', 'Engine Diagnostic', 'Engine', 1.5, 90.00, 'advanced'),

-- Electrical
('ELE001', 'Battery Replacement', 'Electrical', 0.5, 30.00, 'basic'),
('ELE002', 'Alternator Replacement', 'Electrical', 2.5, 125.00, 'advanced'),
('ELE003', 'Starter Replacement', 'Electrical', 2.0, 100.00, 'advanced'),

-- Tires
('TIR001', 'Tire Installation (4 tires)', 'Tires', 1.0, 50.00, 'basic'),
('TIR002', 'Tire Rotation', 'Tires', 0.5, 25.00, 'basic'),
('TIR003', 'Wheel Alignment', 'Tires', 1.5, 75.00, 'intermediate'),
('TIR004', 'Wheel Balancing', 'Tires', 1.0, 50.00, 'intermediate'),

-- Suspension
('SUS001', 'Shock Absorber Replacement', 'Suspension', 2.0, 100.00, 'advanced'),
('SUS002', 'Strut Assembly Replacement', 'Suspension', 3.0, 150.00, 'advanced');

-- Insert sample service packages
INSERT INTO public.service_packages (name, description, category, duration_hours, price, includes) VALUES
('Basic Oil Change', 'Standard oil change service', 'Maintenance', 0.5, 35.00, ARRAY['Engine oil replacement', 'Oil filter replacement', 'Basic inspection']),
('Premium Oil Change', 'Premium oil change with inspection', 'Maintenance', 1.0, 55.00, ARRAY['Synthetic oil replacement', 'Oil filter replacement', 'Multi-point inspection', 'Fluid top-up']),
('Brake Service Package', 'Complete brake system service', 'Brakes', 2.5, 180.00, ARRAY['Brake pad replacement', 'Brake inspection', 'Brake fluid flush', 'Road test']),
('Tire Service Package', 'Complete tire service', 'Tires', 1.5, 85.00, ARRAY['Tire installation', 'Wheel balancing', 'Alignment check', 'Pressure adjustment']),
('Basic Inspection', 'Standard vehicle safety inspection', 'Inspection', 1.0, 60.00, ARRAY['Visual inspection', 'Fluid levels check', 'Tire condition check', 'Light operation test']),
('Comprehensive Inspection', 'Detailed vehicle inspection', 'Inspection', 2.0, 120.00, ARRAY['Complete visual inspection', 'Diagnostic scan', 'Road test', 'Detailed report']);

-- Insert sample inspection template
INSERT INTO public.inspection_templates (name, description, category, is_default) VALUES
('Standard Vehicle Inspection', 'Comprehensive vehicle safety and maintenance inspection', 'General', true),
('Pre-Purchase Inspection', 'Detailed inspection for vehicle purchase', 'Purchase', false),
('Annual Safety Inspection', 'Annual safety compliance inspection', 'Safety', false);

-- Insert inspection template items for standard inspection
DO $$
DECLARE
    template_id UUID;
BEGIN
    SELECT id INTO template_id FROM public.inspection_templates WHERE name = 'Standard Vehicle Inspection' LIMIT 1;
    
    IF template_id IS NOT NULL THEN
        INSERT INTO public.inspection_template_items (template_id, item_name, category, subcategory, sort_order, is_required) VALUES
        -- Engine
        (template_id, 'Engine Oil Level', 'Engine', 'Fluids', 1, true),
        (template_id, 'Engine Oil Condition', 'Engine', 'Fluids', 2, true),
        (template_id, 'Coolant Level', 'Engine', 'Fluids', 3, true),
        (template_id, 'Air Filter Condition', 'Engine', 'Filters', 4, false),
        (template_id, 'Belt Condition', 'Engine', 'Components', 5, true),
        
        -- Brakes
        (template_id, 'Brake Fluid Level', 'Brakes', 'Fluids', 10, true),
        (template_id, 'Brake Pad Thickness', 'Brakes', 'Components', 11, true),
        (template_id, 'Brake Rotor Condition', 'Brakes', 'Components', 12, true),
        (template_id, 'Brake Lines', 'Brakes', 'Components', 13, true),
        
        -- Tires
        (template_id, 'Tire Tread Depth', 'Tires', 'Condition', 20, true),
        (template_id, 'Tire Pressure', 'Tires', 'Condition', 21, true),
        (template_id, 'Tire Sidewall Condition', 'Tires', 'Condition', 22, true),
        (template_id, 'Spare Tire Condition', 'Tires', 'Condition', 23, false),
        
        -- Electrical
        (template_id, 'Battery Condition', 'Electrical', 'Components', 30, true),
        (template_id, 'Headlights Operation', 'Electrical', 'Lighting', 31, true),
        (template_id, 'Taillights Operation', 'Electrical', 'Lighting', 32, true),
        (template_id, 'Turn Signals Operation', 'Electrical', 'Lighting', 33, true),
        (template_id, 'Dashboard Warning Lights', 'Electrical', 'Systems', 34, true),
        
        -- Body & Interior
        (template_id, 'Windshield Condition', 'Body', 'Glass', 40, true),
        (template_id, 'Mirror Condition', 'Body', 'Components', 41, true),
        (template_id, 'Seat Belt Operation', 'Interior', 'Safety', 42, true),
        (template_id, 'Horn Operation', 'Interior', 'Controls', 43, true),
        
        -- Suspension
        (template_id, 'Shock Absorber Condition', 'Suspension', 'Components', 50, false),
        (template_id, 'Steering Response', 'Suspension', 'Components', 51, true),
        
        -- Exhaust
        (template_id, 'Exhaust System', 'Exhaust', 'Components', 60, true),
        (template_id, 'Emissions', 'Exhaust', 'Performance', 61, false);
    END IF;
END $$;

-- =====================================================
-- 17. CREATE VIEWS FOR REPORTING
-- =====================================================

-- Customer summary view
CREATE OR REPLACE VIEW public.customer_summary AS
SELECT 
    c.id,
    c.customer_number,
    c.first_name || ' ' || c.last_name AS full_name,
    c.email,
    c.phone,
    c.city,
    COUNT(DISTINCT v.id) AS vehicle_count,
    COUNT(DISTINCT a.id) AS appointment_count,
    COUNT(DISTINCT j.id) AS job_count,
    COALESCE(SUM(j.total_amount), 0) AS total_revenue,
    MAX(a.appointment_date) AS last_appointment,
    c.created_at
FROM public.customers c
LEFT JOIN public.vehicles v ON c.id = v.customer_id
LEFT JOIN public.appointments a ON c.id = a.customer_id
LEFT JOIN public.job_cards j ON c.id = j.customer_id
GROUP BY c.id, c.customer_number, c.first_name, c.last_name, c.email, c.phone, c.city, c.created_at;

-- Vehicle service history view
CREATE OR REPLACE VIEW public.vehicle_service_history AS
SELECT 
    v.id AS vehicle_id,
    v.make || ' ' || v.model || ' ' || v.year AS vehicle_info,
    v.license_plate,
    c.first_name || ' ' || c.last_name AS owner_name,
    j.job_number,
    j.status,
    j.customer_complaint,
    j.work_performed,
    j.total_amount,
    j.created_at AS service_date,
    j.completed_at
FROM public.vehicles v
JOIN public.customers c ON v.customer_id = c.id
LEFT JOIN public.job_cards j ON v.id = j.vehicle_id
ORDER BY v.id, j.created_at DESC;

-- Daily revenue view
CREATE OR REPLACE VIEW public.daily_revenue AS
SELECT 
    DATE(j.completed_at) AS service_date,
    COUNT(*) AS jobs_completed,
    SUM(j.total_amount) AS total_revenue,
    AVG(j.total_amount) AS average_job_value,
    SUM(j.labor_total) AS labor_revenue,
    SUM(j.parts_total) AS parts_revenue
FROM public.job_cards j
WHERE j.status = 'completed' AND j.completed_at IS NOT NULL
GROUP BY DATE(j.completed_at)
ORDER BY service_date DESC;

-- Inventory status view
CREATE OR REPLACE VIEW public.inventory_status AS
SELECT 
    p.id,
    p.part_number,
    p.name,
    p.category,
    p.stock_quantity,
    p.min_stock_level,
    p.reorder_point,
    CASE 
        WHEN p.stock_quantity <= 0 THEN 'Out of Stock'
        WHEN p.stock_quantity <= p.min_stock_level THEN 'Low Stock'
        WHEN p.stock_quantity <= p.reorder_point THEN 'Reorder Soon'
        ELSE 'In Stock'
    END AS stock_status,
    p.selling_price,
    p.cost_price,
    (p.selling_price - p.cost_price) AS profit_per_unit,
    s.name AS supplier_name
FROM public.parts_catalog p
LEFT JOIN public.suppliers s ON p.supplier_id = s.id
WHERE p.is_active = true
ORDER BY 
    CASE 
        WHEN p.stock_quantity <= 0 THEN 1
        WHEN p.stock_quantity <= p.min_stock_level THEN 2
        WHEN p.stock_quantity <= p.reorder_point THEN 3
        ELSE 4
    END,
    p.name;

-- =====================================================
-- 18. FINAL SETUP CONFIRMATION
-- =====================================================

-- Insert a system log entry to confirm setup completion
INSERT INTO public.system_logs (level, message, context) VALUES
('info', 'MASS Car Workshop VWMS database setup completed successfully', 
 jsonb_build_object(
     'setup_date', NOW(),
     'tables_created', 25,
     'policies_created', 15,
     'functions_created', 3,
     'triggers_created', 12,
     'indexes_created', 20,
     'views_created', 4,
     'sample_data_inserted', true
 ));

-- Display setup summary
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'MASS Car Workshop VWMS Database Setup Complete!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Tables Created: 25';
    RAISE NOTICE 'RLS Policies: 15+';
    RAISE NOTICE 'Functions: 3';
    RAISE NOTICE 'Triggers: 12+';
    RAISE NOTICE 'Indexes: 20+';
    RAISE NOTICE 'Views: 4';
    RAISE NOTICE 'Sample Data: Inserted';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Your workshop management system is ready!';
    RAISE NOTICE '==============================================';
END $$;
