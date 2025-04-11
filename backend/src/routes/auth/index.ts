import express from 'express';
import { router as signupRouter } from './signup';
import { router as loginRouter } from './login';
import { router as googleRouter } from './google';
import { router as forgotPasswordRouter } from './forgot-password';
import { router as resetPasswordRouter } from './reset-password';

const router = express.Router();

router.use('', signupRouter);
router.use('', loginRouter);
router.use('', googleRouter);
router.use('', forgotPasswordRouter);
router.use('', resetPasswordRouter);

export { router as authRouter };
