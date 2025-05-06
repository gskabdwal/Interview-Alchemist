# Interview Alchemist

Interview Alchemist is an AI-powered interview preparation platform that helps users practice and improve their interview skills for various industries and roles. The application generates tailored interview questions, provides answer assistance, and offers detailed feedback to help users succeed in their job interviews.

## Features

- **Generate Questions**: Create tailored interview questions based on your field of expertise, covering a wide range of topics and role-specific scenarios.
- **Answer Assistance**: Get AI-powered suggestions to craft impactful answers, practice with model answers, and simulate real-time interviews.
- **Analyze and Improve**: Receive detailed feedback on your performance, identify strengths and areas for improvement, and track your progress over time.
- **Industry-Specific Interviews**: Practice interviews tailored to specific industries and roles.
- **Subscription Model**: Access premium features with a monthly subscription plan.
- **User Authentication**: Secure login with email/password or social providers (Google, GitHub).
- **User Dashboard**: Track interview progress and performance metrics.
- **Admin Panel**: Manage users, interviews, and application settings.

## Tech Stack

### Frontend
- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [HeroUI](https://heroui.com/) - UI component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Recharts](https://recharts.org/) - Charting library

### Backend
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - API endpoints
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) - Database
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [OpenAI API](https://openai.com/) - AI-powered interview questions and feedback
- [Stripe](https://stripe.com/) - Payment processing
- [Cloudinary](https://cloudinary.com/) - Image storage

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB database
- OpenAI API key
- Stripe account (for payments)
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/interview-alchemist.git
   cd interview-alchemist
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Register/Login**: Create an account or log in with existing credentials.
2. **Subscribe**: Choose a subscription plan to access premium features.
3. **Create Interview**: Select your industry, role, and interview type.
4. **Practice**: Answer generated questions and receive feedback.
5. **Review**: Analyze your performance and areas for improvement.

## Deployment

The application can be deployed on [Vercel](https://vercel.com/) for optimal performance with Next.js:

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Configure the environment variables in the Vercel dashboard.
4. Deploy the application.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for providing the AI capabilities
- [Next.js](https://nextjs.org/) for the React framework
- [Vercel](https://vercel.com/) for hosting and deployment
