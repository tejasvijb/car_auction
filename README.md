# Car Auction System

A RESTful API service for managing car auctions. This system allows users to create, manage, and participate in car auctions.

## Features

- User authentication and authorization
- Create and manage car auctions
- Place bids on cars
- Real-time auction status updates
- Secure transaction handling

## Prerequisites

- Node.js (v22.17.0)
- npm (v6 or higher)
- Git
- Mongodb compass for local development or connection string for production

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tejasvijb/car_auction.git
   ```

2. Navigate to the project directory:

   ```bash
   cd car_auction
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure environment variables:
   - Copy the `.env.example` file to create a new `.env` file
   - Update the environment variables with your configuration

## Development

To start the development server:

```bash
npm run dev
```

The server will start on the configured port (default: 3000).

## API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

Most endpoints require authentication using a JWT token. To get started:

1. Generate a token:

   ```http
   POST /auction/token
   Content-Type: application/json

   {
     "username": "string (min 4 characters)",
     "password": "string (min 4 characters)"
   }
   ```

   Returns a JWT token to be used in subsequent requests.

2. Use the token in the Authorization header:
   ```
   Authorization: Bearer <your_token>
   ```

### Endpoints

#### 1. Create Auction

```http
POST /auction/createAuction
Content-Type: application/json
Authorization: Bearer <token>

{
  "carId": "uuid",
  "startingPrice": "number (min 0)",
  "startTime": "ISO date string",
  "endTime": "ISO date string"
}
```

- Creates a new auction for a specific car
- The endTime must be after startTime

#### 2. Update Auction Status

```http
PATCH /auction/status/:auctionId
Authorization: Bearer <token>
```

Updates the status of an auction. Possible status values:

- active
- cancelled
- ended
- upcoming

#### 3. Place Bid

```http
POST /auction/placeBids
Content-Type: application/json
Authorization: Bearer <token>

{
  "auctionId": "uuid",
  "dealerId": "uuid",
  "bidAmount": "number (positive)"
}
```

Places a bid on an active auction.

#### 4. Get Winner Bid

```http
GET /auction/:auctionId/winnerBid
Authorization: Bearer <token>
```

Retrieves the winning bid for a completed auction.

### Error Responses

The API uses standard HTTP response codes:

- 200: Success
- 400: Bad Request (invalid input)
- 401: Unauthorized (invalid/missing token)
- 404: Not Found
- 500: Internal Server Error

Validation errors will return specific error messages for invalid fields.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
