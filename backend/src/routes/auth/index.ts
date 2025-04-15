import express from 'express';
import { router as signupRouter } from './signup';
import { router as loginRouter } from './login';
import { router as logoutRouter } from './logout';
import { router as googleRouter } from './google';
import { router as forgotPasswordRouter } from './forgot-password';
import { router as resetPasswordRouter } from './reset-password';
import { router as verifyEmailRouter } from './verify-email';

const router = express.Router();

router.use('', signupRouter);
router.use('', loginRouter);
router.use('', googleRouter);
router.use('', forgotPasswordRouter);
router.use('', resetPasswordRouter);
router.use('', verifyEmailRouter);
router.use('', logoutRouter);

export { router as authRouter };
