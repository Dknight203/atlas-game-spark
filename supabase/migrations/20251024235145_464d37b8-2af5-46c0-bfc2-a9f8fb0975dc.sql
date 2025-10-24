-- Grant super_admin role to chrisley@aesopco.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('5b35bd8d-d1cd-407a-a94b-2ceda925fe14', 'super_admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Update password to Admin123!@# (requires pgcrypto extension)
UPDATE auth.users
SET encrypted_password = crypt('Admin123!@#', gen_salt('bf'))
WHERE id = '5b35bd8d-d1cd-407a-a94b-2ceda925fe14';