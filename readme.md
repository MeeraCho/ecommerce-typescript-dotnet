### Prerequisites

Before starting, make sure you have installed:

- .NET SDK
- Node.js
- npm



### Clone Repository

```bash
git clone https://github.com/MeeraCho/ecommerce-typescript-dotnet.git
cd ecommerce-typescript-dotnet
```



### Backend Setup

Navigate to the API folder
```bash
cd API
```
<br />
Restore NuGet packages

```bash
dotnet restore
```
<br />
Apply migrations

```bash
dotnet ef database update
```
<br />
Run the backend server

```bash
dotnet watch
```
<br />
Backend API runs on:

```txt
https://localhost:5001
```



### Frontend Setup

Open another terminal:

```bash
cd client
```
<br />
Install dependencies:

```bash
npm install
```
<br />
Start the frontend:

```bash
npm run dev
```
<br />
Frontend runs on:

```txt
http://localhost:3000
```


### Environment Variables

Update:

```txt
API/appsettings.Development.json
```
<br />
Example:

```json
{
  "StripeSettings": {
    "PublishableKey": "your_publishable_key",
    "SecretKey": "your_secret_key"
  }
}
```


### Database

This project uses SQLite with Entity Framework Core.

Run migrations

```bash
dotnet ef database update
```

SQLite database file will be created automatically.