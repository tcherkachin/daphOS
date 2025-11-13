
  # Redesign Employee Management Dashboard

  This is a code bundle for Redesign Employee Management Dashboard. The original project is available at https://www.figma.com/design/XMGNq6Sw0EcvKwlWvUHMKj/Redesign-Employee-Management-Dashboard.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.



  | Requirement                                         | Where/How implemented                         |
|-----------------------------------------------------|-----------------------------------------------|
| List employees (name, role, status)                 | src/features/employees/EmployeeList.tsx       |
| Create/Edit/Deactivate employee                     | src/features/employees/EmployeeForm.tsx       |
| Data persisted in browser (LocalStorage)            | src/repositories/EmployeeRepo.local.ts        |
| API-ready repo interfaces                           | src/repositories/EmployeeRepo.ts              |
| Master-detail layout                                | src/app/AppLayout.tsx                         |
| Validations (start < end, required fields, etc.)    | src/validation/shiftSchema.ts                 |
| Helpful error messages                              | src/components/FormError.tsx                  |
| Responsive layout                                   | src/styles/tailwind.css / CSS modules         |
| Bonus: Shifts CRUD per employee                     | src/features/shifts/*                         |
| Bonus: Filter/Sort employees                        | src/features/employees/EmployeeToolbar.tsx    |
| Bonus: Hours per day/week chart                     | src/features/shifts/HoursChart.tsx            |
| Optional: tests                                     | src/__tests__/*                               |
