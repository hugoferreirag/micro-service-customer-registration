const modelSubscriber = require("../models/subscriber");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const utils = require("../utils");
const ResponseService = require("./response");

class Subscriber {
  #EMAIL_KEY_STRING = "Email";
  #DOCUMENT_KEY_STRING = "Documento";
  #CREATED_MESSAGE_STRING = "Assinatura efetuada com sucesso!";

  constructor(subscriber = null, response) {
    this.subscriber = subscriber;
    this.keys = [];
    this.response = response;
  }
  get responseService() {
    return new ResponseService(this.response);
  }
  async createSubscriber() {
    try {
      await this.#validateDataReceived();
      await this.#checkAllKeysExistsInModelReceived();
      await this.#validateSubscriberDocuments();
      await this.#checkSubscriberExists();

      this.subscriber.password = await this.#encryptPassword();
      this.subscriber.email = this.subscriber.email.toLowerCase();
      const subscriberCreated = await modelSubscriber.connectDb.create(
        this.subscriber
      );

      const { password, ...rest } = subscriberCreated._doc;
      const token = await this.#generateToken(rest);
      rest.token = token;
      this.responseService.handleSuccess(
        this.responseService.STATUS_NAME.SUCCESS_CREATED,
        this.#CREATED_MESSAGE_STRING,
        rest
      );
    } catch (error) {
      this.responseService.handleError(
        error.statusName,
        error.message,
        error.input
      );
    }
  }

  //methods
  async #checkSubscriberExists() {
    await this.#checkEmailExists(this.subscriber);
    await this.#checkDocumentExists(this.subscriber);
  }

  async #validateSubscriberDocuments() {
    if (!utils.validateEmail(this.subscriber.email.toLowerCase()))
      throw {
        input: this.#EMAIL_KEY_STRING,
        statusName: this.responseService.STATUS_NAME.CLIENT,
        message: this.responseService.mountErrorMessageForIrregularKey(
          this.#EMAIL_KEY_STRING
        ),
      };
    if (!utils.validateDocument(this.subscriber.document))
      throw {
        input: this.#DOCUMENT_KEY_STRING,
        statusName: this.responseService.STATUS_NAME.CLIENT,
        message: this.responseService.mountErrorMessageForIrregularKey(
          this.#DOCUMENT_KEY_STRING
        ),
      };
  }

  async #checkAllKeysExistsInModelReceived() {
    modelSubscriber.modelKeys.map((key) => {
      if (!this.keys.includes(key))
        throw {
          input: key,
          statusName: this.responseService.STATUS_NAME.CLIENT,
          message: this.responseService.mountErrorMessageForIrregularKey(key),
        };
    });
  }

  async #validateDataReceived() {
    Object.entries(this.subscriber).map(([key, value]) => {
      if (!key || !modelSubscriber.modelKeys.includes(key))
        throw {
          input: key,
          statusName: this.responseService.STATUS_NAME.CLIENT,
          message: this.responseService.mountErrorMessageForIrregularKey(key),
        };
      if (!value)
        throw {
          input: key,
          statusName: this.responseService.STATUS_NAME.CLIENT,
          message: this.responseService.mountErrorMessageForIrregularKey(key),
        };
      this.keys.push(key);
    });
  }

  async #encryptPassword() {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(this.subscriber.password, salt);
  }

  async #generateToken(params) {
    return jwt.sign(params, process.env.SECRET);
  }
  async #checkEmailExists() {
    console.log(this.subscriber.email);
    const existEmail = await modelSubscriber.connectDb.findOne({
      email: this.subscriber.email.toLowerCase(),
    });
    if (existEmail)
      throw {
        input: this.#EMAIL_KEY_STRING,
        statusName: this.responseService.STATUS_NAME.CLIENT,
        message: this.responseService.mountErrorMessageForRegisterExistsInDb(
          this.#EMAIL_KEY_STRING
        ),
      };
  }
  async #checkDocumentExists() {
    const existDocument = await modelSubscriber.connectDb.findOne({
      document: this.subscriber.document,
    });

    if (existDocument)
      throw {
        input: this.#DOCUMENT_KEY_STRING,
        statusName: this.responseService.STATUS_NAME.CLIENT,
        message: this.responseService.mountErrorMessageForRegisterExistsInDb(
          this.#DOCUMENT_KEY_STRING
        ),
      };
  }
}
module.exports = Subscriber;
