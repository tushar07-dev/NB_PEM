
// /**
//  * Default/fallback handlers.
//  *
//  * Feature-specific handlers should be added here as the project grows,
//  * or override them per-test with server.use(...) inside the test file.
//  *
//  * Example:
//  *   server.use(
//  *     http.get("/api/Checklist/GetAll", () =>
//  *       HttpResponse.json({ success: true, data: { data: [], totalRecords: 0 } })
//  *     )
//  *   );
//  */
// export const handlers = [
// import { http, HttpResponse } from 'msw';

// /**
//  * MSW handlers for API mocking in tests.
//  * Add or override handlers per feature as needed.
//  */
// export const handlers = [
//   // Example: Checklist API - GetAll
//   http.get('/api/Checklist/GetAll', () =>
//     HttpResponse.json({
//       success: true,
//       message: 'Fetched checklists',
//       data: {
//         data: [
//           { checklistId: '1', name: 'Safety', isActive: true },
//           { checklistId: '2', name: 'Quality', isActive: false },
//         ],
//         totalRecords: 2,
//         pageNumber: 1,
//       },
//     })
//   ),

//   // Example: Checklist API - Create
//   http.post('/api/Checklist/CreateChecklist', async ({ request }) => {
//     const body = await request.json();
//     return HttpResponse.json({
//       success: true,
//       message: 'Checklist created',
//       data: { checklistId: '3', ...body },
//     });
//   }),

//   // Example: Auth API - Login
//   http.post('/api/Auth/Login', async ({ request }) => {
//     const { username } = await request.json();
//     return HttpResponse.json({
//       success: true,
//       message: 'Login successful',
//       data: { token: 'mock-token', user: { username } },
//     });
//   }),

//   // Add more handlers as needed for other endpoints/features
// ];
// ];
