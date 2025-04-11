import express from 'express';
import { router as signupRouter } from './signup';
import { router as loginRouter } from './login';
import { router as googleRouter } from './google';

const router = express.Router();

router.use('', signupRouter);
router.use('', loginRouter);
router.use('', googleRouter);

export { router as authRouter };
