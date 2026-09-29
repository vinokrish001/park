-- Run this in DBeaver on database emp_manage

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  role VARCHAR(80) NOT NULL,
  department VARCHAR(80) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  start_date DATE NOT NULL,
  manager VARCHAR(100)
);

INSERT INTO employees (full_name, email, role, department, status, start_date, manager) VALUES
('Maya Patel', 'maya.patel@northstar.co', 'Product Designer', 'Product', 'Active', '2024-01-12', 'Noah Williams'),
('Noah Williams', 'noah.williams@northstar.co', 'Engineering Lead', 'Engineering', 'Active', '2022-10-03', NULL),
('Sofia Chen', 'sofia.chen@northstar.co', 'People Partner', 'People', 'On leave', '2023-03-18', 'Noah Williams'),
('Liam Brooks', 'liam.brooks@northstar.co', 'Finance Analyst', 'Finance', 'Active', '2024-06-27', 'Noah Williams'),
('Amara Okafor', 'amara.okafor@northstar.co', 'Account Executive', 'Sales', 'Active', '2023-02-09', 'Noah Williams'),
('Ethan Rivera', 'ethan.rivera@northstar.co', 'Support Specialist', 'Customer Care', 'Active', '2024-08-16', 'Noah Williams'),
('Jane Doe', 'jane.doe@northstar.co', 'Product Designer', 'Product', 'Active', '2024-01-12', 'Noah Williams'),
('Aarav Sharma', 'aarav.sharma@northstar.co', 'Software Engineer', 'Engineering', 'Active', '2023-05-01', 'Noah Williams'),
('Priya Nair', 'priya.nair@northstar.co', 'HR Executive', 'People', 'Active', '2022-11-14', 'Sofia Chen'),
('Daniel Kim', 'daniel.kim@northstar.co', 'QA Engineer', 'Engineering', 'Active', '2024-03-04', 'Noah Williams'),
('Sara Ali', 'sara.ali@northstar.co', 'Marketing Lead', 'Sales', 'Active', '2021-09-20', 'Noah Williams'),
('Omar Hassan', 'omar.hassan@northstar.co', 'Accountant', 'Finance', 'On leave', '2023-07-11', 'Liam Brooks'),
('Nina Volkov', 'nina.volkov@northstar.co', 'UX Researcher', 'Product', 'Active', '2022-12-01', 'Maya Patel'),
('Chris Evans', 'chris.evans@northstar.co', 'Support Lead', 'Customer Care', 'Active', '2020-08-08', 'Noah Williams'),
('Meera Iyer', 'meera.iyer@northstar.co', 'Recruiter', 'People', 'Active', '2024-04-22', 'Sofia Chen'),
('Tom Baker', 'tom.baker@northstar.co', 'Sales Associate', 'Sales', 'Active', '2023-10-30', 'Amara Okafor'),
('Hannah Lee', 'hannah.lee@northstar.co', 'Backend Engineer', 'Engineering', 'Active', '2021-06-15', 'Noah Williams'),
('Rohit Gupta', 'rohit.gupta@northstar.co', 'Frontend Engineer', 'Engineering', 'On leave', '2024-02-19', 'Noah Williams'),
('Elena Rossi', 'elena.rossi@northstar.co', 'Finance Manager', 'Finance', 'Active', '2019-01-07', NULL),
('Kevin Brown', 'kevin.brown@northstar.co', 'Customer Success', 'Customer Care', 'Active', '2023-09-12', 'Chris Evans'),
('Anita Desai', 'anita.desai@northstar.co', 'Product Manager', 'Product', 'Active', '2022-04-18', 'Noah Williams'),
('James Wilson', 'james.wilson@northstar.co', 'DevOps Engineer', 'Engineering', 'Active', '2023-01-25', 'Noah Williams'),
('Fatima Zahra', 'fatima.zahra@northstar.co', 'Legal Counsel', 'People', 'Active', '2021-03-09', 'Sofia Chen'),
('Luis Garcia', 'luis.garcia@northstar.co', 'Sales Manager', 'Sales', 'Active', '2020-05-16', NULL);
