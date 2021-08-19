const ResponseService = require("./response");
const modelSubscriber = require("../models/subscriber");
const bcrypt = require("bcrypt");
class Auth {
  #LOGGED_MESSAGE_STRING = "Login efetuado com sucesso.";
  #EMAIL_KEY_STRING = "email";
  #PASSWORD_KEY_STRING = "password";
  #subscriber = null;
  constructor(payload, response) {
    this.response = response;
    this.payload = payload;
  }
  get responseService() {
    return new ResponseService(this.response);
  }

  async login() {
    try {
      await this.#validateInputLogin();
      await this.#checkExistsSubscriber();
      await this.#comparePassword();

      this.responseService.handleSuccess(
        this.responseService.STATUS_NAME.SUCCESS,
        this.#LOGGED_MESSAGE_STRING,
        this.#subscriber
      );
    } catch (error) {
      this.responseService.handleError(
        error.statusName,
        error.message,
        error.input
      );
    }
  }

  #validateInputLogin() {
    if (!this.payload.email)
      this.responseService.handleError(
        this.responseService.STATUS_NAME.CLIENT,
        this.responseService.mountErrorMessageForIrregularKey(
          this.#EMAIL_KEY_STRING
        ),
        this.#EMAIL_KEY_STRING
      );
    if (!this.payload.password)
      this.responseService.handleError(
        this.responseService.STATUS_NAME.CLIENT,
        this.responseService.mountErrorMessageForIrregularKey(
          this.#PASSWORD_KEY_STRING
        ),
        this.#PASSWORD_KEY_STRING
      );
  }
  async #checkExistsSubscriber() {
    const existSubscriber = await modelSubscriber.connectDb
      .findOne({ email: this.payload.email })
      .select(`+${this.#PASSWORD_KEY_STRING}`);
    console.log(existSubscriber);
    if (!existSubscriber)
      throw {
        statusName: this.responseService.STATUS_NAME.CLIENT,
        message: this.responseService.mountErrorMessageForRegisterExistsInDb(
          this.#EMAIL_KEY_STRING,
          this.payload.email,
          this.#EMAIL_KEY_STRING
        ),
      };
    this.#setSubscriber(existSubscriber);
  }
  async #comparePassword() {
    if (!bcrypt.compareSync(this.payload.password, this.#subscriber.password))
      throw {
        statusName: this.responseService.STATUS_NAME.CLIENT,
        message: this.responseService.mountErrorMessageForRegisterExistsInDb(
          this.#PASSWORD_KEY_STRING,
          this.payload.password,
          this.#PASSWORD_KEY_STRING
        ),
      };
    this.#hidePassword();
  }
  #setSubscriber(data) {
    this.#subscriber = data;
  }
  #hidePassword() {
    this.#subscriber.password = undefined;
  }
}

module.exports = Auth;
