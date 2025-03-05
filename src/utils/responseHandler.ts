class ResponseHandler {
  public success(response: any, status: any, responseData: any = {}) {
    return response.status(status).send(responseData);
  }

  public error(response: any, status: any, responseData: any = {}) {
    return response.status(status).send(responseData);
  }
}
export default new ResponseHandler();
