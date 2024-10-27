import { ApiClient, ApiResponse } from '../api-helper';

describe('Mock ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient('https://api.example.com');
  });

  afterEach(() => {
    // Clean up any necessary resources
  });

  it('should perform a GET request and return the API response', async () => {
    // Mock the fetch method and response
    const mockResponse = {
      data: { id: 1, name: 'Product 1' },
      status: 200,
      statusText: 'OK',
    };
    jest.spyOn(apiClient as any, 'get').mockResolvedValue(mockResponse);

    // Make the GET request
    const response: ApiResponse<any> = await apiClient.get('/products/1');

    // Verify the response
    expect(response).toEqual(mockResponse);
  });

  it('should perform a POST request and return the API response', async () => {
    // Mock the fetch method and response
    const mockResponse = {
      data: { id: 1, name: 'Product 1' },
      status: 201,
      statusText: 'Created',
    };
    jest.spyOn(apiClient as any, 'fetch').mockResolvedValue(mockResponse);

    // Make the POST request
    const requestBody = { name: 'New Product' };
    const response: ApiResponse<any> = await apiClient.post(
      '/products',
      null,
      requestBody,
    );

    // Verify the response
    expect(response).toEqual(mockResponse);
  });

  it('should perform a PUT request and return the API response', async () => {
    // Mock the fetch method and response
    const mockResponse = {
      data: { id: 1, name: 'Product 1' },
      status: 200,
      statusText: 'OK',
    };
    jest.spyOn(apiClient as any, 'fetch').mockResolvedValue(mockResponse);

    // Make the PUT request
    const requestBody = { name: 'Updated Product' };
    const response: ApiResponse<any> = await apiClient.put(
      '/products/1',
      null,
      requestBody,
    );

    // Verify the response
    expect(response).toEqual(mockResponse);
  });

  it('should perform a PATCH request and return the API response', async () => {
    // Mock the fetch method and response
    const mockResponse = {
      data: { id: 1, name: 'Product 1' },
      status: 200,
      statusText: 'OK',
    };
    jest.spyOn(apiClient as any, 'fetch').mockResolvedValue(mockResponse);

    // Make the PATCH request
    const requestBody = { name: 'Updated Product' };
    const response: ApiResponse<any> = await apiClient.patch(
      '/products/1',
      null,
      requestBody,
    );

    // Verify the response
    expect(response).toEqual(mockResponse);
  });

  it('should perform a DELETE request and return the API response', async () => {
    // Mock the fetch method and response
    const mockResponse = {
      data: null,
      status: 204,
      statusText: 'No Content',
    };
    jest.spyOn(apiClient as any, 'fetch').mockResolvedValue(mockResponse);

    // Make the DELETE request
    const response: ApiResponse<any> = await apiClient.delete('/products/1');

    // Verify the response
    expect(response).toEqual(mockResponse);
  });
});
