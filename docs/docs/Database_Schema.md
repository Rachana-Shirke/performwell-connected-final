# Database Schema

## Employees Table
- id
- name
- email
- department
- designation
- manager_id
- joining_date
- status

## Goals Table
- id
- employee_id
- title
- description
- due_date
- progress
- status

## Reviews Table
- id
- employee_id
- reviewer_id
- rating
- comments
- review_date

## Feedback Table
- id
- employee_id
- giver_id
- message
- created_at