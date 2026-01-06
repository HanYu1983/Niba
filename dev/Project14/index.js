const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 构建GraphQL schema
const schema = buildSchema(`
  type Car {
    id: ID
    make: String
    model: String
    year: Int
    price: Float
  }
  type People {
    id: ID
    name: String
    age: Int
    cars: [Car]
  }
  type Query {
    hello: String
    cars: [Car]
    peoples: [People]
    car_by_id(id: ID!): Car!
    cars_by_year(year: Int!): [Car]
    add_car(id: ID!, make: String, model: String, year: Int, price: Float): Car
    me: User
    login(username: String!, password: String!): AuthPayload
    signup(username: String!, password: String!): AuthPayload
    get_image_size(url: String!): ImageSize
  }

  type ImageSize {
    width: Int!
    height: Int!
  }
  
  type User {
    id: ID!
    username: String!
  }
  
  type AuthPayload {
    token: String!
    user: User!
  }
`);

// 定义resolver
const SECRET_KEY = 'your-secret-key';

const users = [];

const root = {
    hello: () => 'Hello world!',
    me: async (_, ctx) => {
        const token = ctx.token;
        if (!token) throw new Error('Not authenticated');
        const decoded = jwt.verify(token, SECRET_KEY);
        return users.find(user => user.id == decoded.userId);
    },
    login: async ({ username, password }) => {
        const user = users.find(user => user.username === username);
        if (!user) throw new Error('User not found');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid password');
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        return { token, user };
    },
    signup: async ({ username, password }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { id: users.length + 1, username, password: hashedPassword };
        users.push(user);
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        return { token, user };
    },
    cars: async (_, ctx) => {
        const cars = [];
        for (let i = 1; i <= 10; i++) {
            cars.push({
                id: i,
                make: `Make ${i}`,
                model: `Model ${i}`,
                year: 2020 + i,
            })
        }
        return cars;
    },
    peoples: async (_, ctx) => {
        const peoples = [];
        for (let i = 1; i <= 10; i++) {
            peoples.push({
                id: i,
                name: `Name ${i}`,
                age: 20 + i,
                cars: (await root.cars()).slice(i - 1, i + 1)
            })
        }
        return peoples;
    },
    car_by_id: async ({ id }, ctx) => {
        const cars = await root.cars();
        // ID比對不要使用===，因為可能是字串也可能是數字
        return cars.find(car => car.id == id);
    },
    cars_by_year: async ({ year }, ctx) => {
        const cars = await root.cars();
        return cars.filter(car => car.year === year);
    },
    add_car: async ({ id, make, model, year, price }, ctx) => {
        await root.me({}, ctx) // authenticate
        const car = {
            id,
            make,
            model,
            year,
            price
        };
        return car;
    },
    get_image_size: async ({ url }) => {
        const { execSync } = require('child_process');
        try {
            const output = execSync(`identify -format '%w %h' ${url}`).toString().trim();
            const [width, height] = output.split(' ').map(Number);
            return { width, height };
        } catch (error) {
            throw new Error('Failed to get image size: ' + error.message);
        }
    }
};

const app = express();

app.use(express.json());

// const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     const token = authHeader.split(' ')[1];
//     try {
//       req.user = jwt.verify(token, SECRET_KEY);
//     } catch (err) {
//       return res.status(403).json({ message: 'Invalid token' });
//     }
//     next();
//   } else {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// };

// app.use(authenticate);

app.use('/graphql', graphqlHTTP((req) => {
    return {
        schema: schema,
        rootValue: root,
        graphiql: true,
        context: {
            token: req.headers.authorization?.split(' ')?.[1]
        }
    }
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
});