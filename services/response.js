class ResponseService {
  constructor(response) {
    this.response = response;
  }
  get STATUS_NAME() {
    return Object.freeze({
      SERVICE: "SERVICE",
      CLIENT: "CLIENT",
      UNAUTHORIZED: "UNAUTHORIZED",
      SUCCESS: "SUCCESS",
      SUCCESS_CREATED: "SUCCESS_CREATED",
      SUCCESS_NO_CONTENT: "SUCCESS_NO_CONTENT",
    });
  }
  get STATUS_ERRORS() {
    return Object.freeze({
      REQUEST_ERROR_SERVICE: 500,
      REQUEST_ERROR_CLIENT: 400,
      REQUEST_ERROR_UNAUTHORIZED: 403,
    });
  }
  get STATUS_SUCCESS() {
    return Object.freeze({
      REQUEST_SUCCESS: 200,
      REQUEST_SUCCESS_CREATED: 201,
      REQUEST_SUCCESS_NO_CONTENT: 204,
    });
  }
  handleError(statusName = null, message = null, input = null) {
    switch (statusName) {
      case this.STATUS_NAME.SERVICE:
        this.#serviceError(message, input);
        break;
      case this.STATUS_NAME.CLIENT:
        this.#clientError(message, input);
        break;
      case this.STATUS_NAME.UNAUTHORIZED:
        this.#authorizationError(message, input);
        break;
      default:
        this.#serviceError(message, input);
        break;
    }
  }
  handleSuccess(statusName = null, message = null, data = null) {
    switch (statusName) {
      case this.STATUS_NAME.SUCCESS:
        this.#requestSuccess(message, data);
        break;
      case this.STATUS_NAME.SUCCESS_CREATED:
        this.#requestCreated(message, data);
        break;
      case this.STATUS_NAME.SUCCESS_NO_CONTENT:
        this.#requestSuccessNoContent(message, data);
        break;
      default:
        this.#requestSuccess(message, data);
        break;
    }
  }
  #clientError(message, input) {
    this.response
      .status(this.STATUS_ERRORS.REQUEST_ERROR_CLIENT)
      .json({ message: message, input: input });
  }
  #authorizationError(message, input) {
    this.response
      .status(this.STATUS_ERRORS.REQUEST_ERROR_UNAUTHORIZED)
      .json({ message: message, input: input });
  }
  #serviceError(message, input) {
    this.response
      .status(this.STATUS_ERRORS.REQUEST_ERROR_SERVICE)
      .json({ message: message, input: input });
  }
  #requestSuccess(message, data) {
    this.response
      .status(this.STATUS_SUCCESS.REQUEST_SUCCESS)
      .json({ message: message, data: data ?? null });
  }
  #requestCreated(message, data) {
    this.response
      .status(this.STATUS_SUCCESS.REQUEST_SUCCESS_CREATED)
      .json({ message: message, data: data ?? null });
  }
  #requestSuccessNoContent(message, data) {
    this.response
      .status(this.STATUS_SUCCESS.REQUEST_SUCCESS_NO_CONTENT)
      .json({ message: message, data: data ?? null });
  }
  mountErrorMessageForIrregularKey(key) {
    return `Dados recebidos inválidos, campo '${key}', não existe, é nulo ou está descrito de forma incorreta`;
  }
  mountErrorMessageForRegisterExistsInDb(key) {
    return `${key} ja está em uso !`;
  }
}

module.exports = ResponseService;
