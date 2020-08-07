import express from "express";

const app = express();

app.use(express.json());

app.get("/users", (request, response) => {
  console.log(request.query);

  const users = [
    { name: "Vania", age: 30 },
    { name: "Diego", age: 43 },
  ];

  return response.json(users);
});

app.listen(3333);
