# Frontend

##  Stack

- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui, Lucide Icons
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **Image Handling:** Next.js Image Optimization + Supabase Storage + sharp


Below are some key sections of the interface with screenshots.

## Dashboard

- Users can query posts using text
- Queries can include filters for more precise results
- Users can also query with filters only (without text)
- Pagination allows quick navigation between pages
- Queries use the [FTS](https://en.wikipedia.org/wiki/Full-text_search) method
- Access to user settings

![Dashboard](https://raw.githubusercontent.com/toniswx/leafe/main/frontend/public/dashboard.png)

## New Ad Form

- Integrated with the [ViaCEP API](https://viacep.com.br/) to automatically fetch and fill in address details
- Images are converted to WEBP and optimized — [see the microservice code here](https://github.com/toniswx/leafe/blob/main/rabbitmq/src/app.service.ts)
- Photos are stored in Supabase cloud storage

![new-add](https://raw.githubusercontent.com/toniswx/leafe/main/frontend/public/new-add.png)

## Ad View in User Dashboard

- Quick view of the ad

![view-post](https://raw.githubusercontent.com/toniswx/leafe/main/frontend/public/view-post.png)

## Profile

- Users can change their name and bio  
- TO-DO: Add profile photo support  

![profile](https://raw.githubusercontent.com/toniswx/leafe/main/frontend/public/profile.png)

## Security 

- Users can change their password
- Users can generate recovery codes — [see the code here](https://github.com/toniswx/leafe/blob/main/backend/src/users/users.service.ts)
- Users can add a recovery email — [see the code here](https://github.com/toniswx/leafe/blob/main/backend/src/email/email.service.ts)
- Users can verify their email — [see the code here](https://github.com/toniswx/leafe/blob/main/backend/src/email/email.service.ts)

![security](https://raw.githubusercontent.com/toniswx/leafe/main/frontend/public/security.png)
