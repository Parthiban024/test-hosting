import express from "express";
import {
  forgotPasswordRouteHandler,
  loginRouteHandler,
  pmInputRouteHandler,
  registerRouteHandler,
  resetPasswordRouteHandler,
  userInputRouteHandler,
} from "../../services/auth";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body.data.attributes;
  await loginRouteHandler(req, res, email, password);
});

router.post("/logout", (req, res) => {
  return res.sendStatus(204);
});

router.post("/register", async (req, res) => {
  const { empid, name, email, password } = req.body.data.attributes;
  await registerRouteHandler(req, res, empid, name, email, password);
});

router.post("/userinput", async (req, res) => {
  const { empid, name, email, department, status, team, shift, manager, location, date } = req.body.data.attributes;
  await userInputRouteHandler(req, res, empid, name, email, department, status, team, shift, manager, location, date);
});

router.post("/pminput", async (req, res) => {
  const { addproject } = req.body.data.attributes;
  await pmInputRouteHandler(req, res, addproject);
});

router.post("/password-forgot", async (req, res) => { 
  const { email } = req.body.data.attributes;
  await forgotPasswordRouteHandler(req, res, email);
});

router.post("/password-reset", async (req, res) => {
  await resetPasswordRouteHandler(req, res);
});

export default router;
