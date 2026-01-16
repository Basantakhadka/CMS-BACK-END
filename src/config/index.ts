import app from "CMS-BACK-END/src/config/app";
import auth from "CMS-BACK-END/src/config/authentication";
import crypto from "CMS-BACK-END/src/config/crypto";
import db from "CMS-BACK-END/src/config/database";
import services from "CMS-BACK-END/src/config/services";
import kafka from "CMS-BACK-END/src/config/kafka";
import settings from "CMS-BACK-END/src/config/settings";

import mailer from "./mailer";

export default [app, db, crypto, settings, kafka, services, mailer, auth];
