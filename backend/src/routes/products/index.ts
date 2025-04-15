import express from 'express';
import { router as addRouter } from './add';
import { router as deleteRouter } from './delete';
import { router as getRouter } from './get';
import { router as listRouter } from './list';
import { router as updateRouter } from './update';

const router = express.Router();

router.use('', addRouter);
router.use('', deleteRouter);
router.use('', getRouter);
router.use('', listRouter);
router.use('', updateRouter);

export { router as productRouter };
