import express from 'express';
const userRouter = express.Router();

type User = {
  name: string;
};

userRouter.get('/', (req, res) => {
  res.send('User List');
});

userRouter.get('/new', (req, res) => {
  res.send('New User Form');
});

userRouter.post('/', (req, res) => {
  res.send('Create User');
});

userRouter
  .route('/:id')
  .get((req, res) => {
    console.log(req.user);
    res.send(`Get User With ID ${req.params.id}`);
  })
  .put((req, res) => {
    res.send(`Update User With ID ${req.params.id}`);
  })
  .delete((req, res) => {
    res.send(`Delete User With ID ${req.params.id}`);
  });

const users: User[] = [{ name: 'Mike' }, { name: 'Lara' }];

userRouter.param('id', (req, res, next, id) => {
  req.user = users[id];
  next();
});

export default userRouter;
