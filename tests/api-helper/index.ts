export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  Cookie?: string;
}

export class ApiClient {
  private baseUrl: string;

  private token?: string;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  static isObject(input: string): boolean {
    try {
      return !!JSON.parse(input);
    } catch (error) {
      return false;
    }
  }

  /**
   * Internal method to handle the actual HTTP request.
   * Sets headers, makes the request, and parses the response.
   */
  private async fetch<T>(
    url: string,
    options?: RequestInit,
    customHeaders?: { [key: string]: string },
  ): Promise<ApiResponse<T>> {
    let headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const hasCustomHeaders =
      customHeaders && Object.values(customHeaders)?.length;

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    if (hasCustomHeaders) {
      headers = { ...headers, ...customHeaders };
    }

    // Add the text body to the options if provided
    if (
      options &&
      options.body &&
      typeof options.body === 'string' &&
      !headers['Content-Type'] &&
      !ApiClient.isObject(options.body)
    ) {
      headers['Content-Type'] = 'text/plain'; // Set the Content-Type for the text body
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} - ${response.statusText}`,
      );
    }

    const contentType = response?.headers?.get('Content-Type');
    let data: T = {} as T;
    // Check the content type to perform further actions
    if (
      contentType &&
      (contentType.includes('application/json') || hasCustomHeaders)
    ) {
      // Handle JSON response
      data = response.status !== 201 ? await response.json() : {};
    } else {
      console.info('Unsupported Response Type');
      // Handle other types of responses
      try {
        data = response.status !== 201 ? await response.json() : {};
      } catch (error) {
        console.info(
          `ERROR_TRYING_TO_PARSE_UNSUPPORTED_CONTENT_TYPE: ${contentType}`,
          error,
        );
      }
    }

    if (response.status >= 400) {
      console.info(
        `Request failed: ${response.status} - ${contentType} - ${response.statusText}`,
      );
    }

    // Extract cookies from the response headers
    const responseCookies = response.headers?.get('set-cookie');

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      Cookie: responseCookies ?? undefined, // Include cookies in the response
    };
  }

  /**
   * Set the token to be used for authorization.
   */
  public setToken(token: string): void {
    this.token = token;
  }

  /**
   * @description
   * Perform a GET request to the specified endpoint.
   * Supports query parameters.
   *
   * @method GET
   *
   * @param {string} endpoint API endpoint
   * @param {Record<string, any> | null} queryParams API query params
   * @param {{ [key: string]: string | number | any }} body API request body/payload
   * @param {{ [key: string]: string }} headers API request headers
   *
   * @returns {Promise<ApiResponse<T>>} API response
   */
  public async get<T>(
    endpoint: string,
    queryParams?: Record<string, any>,
    headers?: { [key: string]: string },
  ): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    if (queryParams) {
      Object.keys(queryParams).forEach(key =>
        url.searchParams.append(key, queryParams[key]),
      );
    }

    return this.fetch<T>(url.toString(), undefined, headers);
  }

  /**
   * @description
   * Perform a POST request with x-www-form-urlencoded data to the specified endpoint.
   *
   * @method POST
   *
   * @param {string} endpoint API endpoint
   * @param {Record<string, any> | null} queryParams API query params
   * @param {Record<string, string>} formData x-www-form-urlencoded data as an object
   * @param {{ [key: string]: string }} headers API request headers
   *
   * @returns {Promise<ApiResponse<T>>} API response
   */
  public async postForm<T>(
    endpoint: string,
    queryParams?: Record<string, any> | null,
    formData?: Record<string, string>,
    headers?: { [key: string]: string },
  ): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    if (queryParams) {
      Object.keys(queryParams).forEach(key =>
        url.searchParams.append(key, queryParams[key]),
      );
    }

    // Convert the formData object to URLSearchParams
    const formDataParams = new URLSearchParams(formData);

    return this.fetch<T>(
      url.toString(),
      {
        method: 'POST',
        body: formDataParams.toString(),
      },
      {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    );
  }

  /**
   * @description
   * Perform a POST request to the specified endpoint.
   * Takes an optional request body.
   *
   * @method POST
   *
   * @param {string} endpoint API endpoint
   * @param {Record<string, any> | null} queryParams API query params
   * @param {{ [key: string]: string | number | any }} body API request body/payload
   * @param {{ [key: string]: string }} headers API request headers
   *
   * @returns {Promise<ApiResponse<T>>} API response
   */
  public async post<T>(
    endpoint: string,
    queryParams?: Record<string, any> | null,
    body?: any,
    headers?: { [key: string]: string },
  ): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    if (queryParams) {
      Object.keys(queryParams).forEach(key =>
        url.searchParams.append(key, queryParams[key]),
      );
    }

    let payload = body;

    if (typeof body === 'object') {
      payload = JSON.stringify(body);
    }

    return this.fetch<T>(
      url.toString(),
      {
        method: 'POST',
        body: payload,
      },
      headers,
    );
  }

  /**
   * @description
   * Perform a POST request to the specified endpoint.
   * Takes an optional request body.
   *
   * @method POST
   *
   * @param {string} endpoint API endpoint
   * @param {string} username basic auth username
   * @param {string} password basic auth password
   * @param {Record<string, any> | null} queryParams API query params
   * @param {{ [key: string]: string }} headers API request headers
   *
   * @returns {Promise<ApiResponse<T>>} API response
   */
  public async getWithBasicAuth<T>(
    endpoint: string,
    username: string,
    password: string,
    queryParams?: Record<string, any> | null,
    headers?: { [key: string]: string },
  ): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    if (queryParams) {
      Object.keys(queryParams).forEach(key =>
        url.searchParams.append(key, queryParams[key]),
      );
    }

    // Construct Basic Authentication header
    const base64Credentials = btoa(`${username}:${password}`);
    const authHeader = `Basic ${base64Credentials}`;

    const authHeaders = {
      Authorization: authHeader,
      ...(headers || {}),
    };

    return this.fetch<T>(url.toString(), undefined, authHeaders);
  }

  /**
   * @description
   * Perform a PUT request to the specified endpoint.
   * Takes an optional request body.
   *
   * @method PUT
   *
   * @param {string} endpoint API endpoint
   * @param {Record<string, any> | null} queryParams API query params
   * @param {{ [key: string]: string | number | any }} body API request body/payload
   * @param {{ [key: string]: string }} headers API request headers
   *
   * @returns {Promise<ApiResponse<T>>} API response
   */
  public async put<T>(
    endpoint: string,
    queryParams?: Record<string, any> | null,
    body?: any,
    headers?: { [key: string]: string },
  ): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    if (queryParams) {
      Object.keys(queryParams).forEach(key =>
        url.searchParams.append(key, queryParams[key]),
      );
    }

    let payload = body;

    if (typeof body === 'object') {
      payload = JSON.stringify(body);
    }

    return this.fetch<T>(
      url.toString(),
      {
        method: 'PUT',
        body: payload,
      },
      headers,
    );
  }

  /**
   * @description
   * Perform a PATCH request to the specified endpoint.
   * Takes an optional request body.
   *
   * @method PATCH
   *
   * @param {string} endpoint API endpoint
   * @param {Record<string, any> | null} queryParams API query params
   * @param {{ [key: string]: string | number | any }} body API request body/payload
   * @param {{ [key: string]: string }} headers API request headers
   *
   * @returns {Promise<ApiResponse<T>>} API response
   */
  public async patch<T>(
    endpoint: string,
    queryParams?: Record<string, any> | null,
    body?: any,
    headers?: { [key: string]: string },
  ): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    if (queryParams) {
      Object.keys(queryParams).forEach(key =>
        url.searchParams.append(key, queryParams[key]),
      );
    }

    let payload = body;

    if (typeof body === 'object') {
      payload = JSON.stringify(body);
    }

    return this.fetch<T>(
      url.toString(),
      {
        method: 'PATCH',
        body: payload,
      },
      headers,
    );
  }

  /**
   * @description
   * Perform a DELETE request to the specified endpoint.
   *
   * @method DELETE
   *
   * @param {string} endpoint API endpoint
   *
   * @returns {Promise<ApiResponse<T>>} API response
   */
  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);

    return this.fetch<T>(url.toString(), {
      method: 'DELETE',
    });
  }
}
