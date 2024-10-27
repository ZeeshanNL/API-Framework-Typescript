import { ApiClient, ApiResponse } from '../api-helper';
import { BASE_URL } from '../constants/apiConstants';

describe('FakeStoreAPI https://fakestoreapi.com/ ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient(BASE_URL);
  });

  afterEach(() => {
    // Clean up any necessary resources
  });

  it('should perform a GET request and return the API response', async () => {
    // Make the GET request
    const response: ApiResponse<
      {
        id: number;
        title: string;
        price: number;
        description: string;
        category: string;
        image: string;
        rating: {
          rate: number;
          count: number;
        };
      }[]
    > = await apiClient.get('/products');

    // Verify the response
    expect(response.status).toEqual(200);
    expect(response.data.length).toBeGreaterThan(1);
    expect(response.data[0]).toMatchObject({
      id: 1,
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    });
  });

  it('should perform a POST request and return the API response', async () => {
    // Make the POST request
    const requestBody = {
      title: 'test product',
      price: 13.5,
      description: 'lorem ipsum set',
      image: 'https://i.pravatar.cc',
      category: 'electronic',
    };
    const response: ApiResponse<any> = await apiClient.post(
      '/products',
      null,
      requestBody,
    );

    // Verify the response
    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject({ title: 'test product' });
  });

  it('should perform a PUT request and return the API response', async () => {
    // Make the POST request
    const requestBody = {
      title: 'test product',
      price: 13.5,
      description: 'lorem ipsum set',
      image: 'https://i.pravatar.cc',
      category: 'electronic',
    };
    const response: ApiResponse<any> = await apiClient.put(
      '/products/1',
      null,
      requestBody,
    );

    // Verify the response
    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject({ title: 'test product' });
  });

  it('should perform a PATCH request and return the API response', async () => {
    // Make the POST request
    const requestBody = {
      title: 'test product',
      price: 13.5,
      description: 'lorem ipsum set',
      image: 'https://i.pravatar.cc',
      category: 'electronic',
    };
    const response: ApiResponse<any> = await apiClient.patch(
      '/products/1',
      null,
      requestBody,
    );

    // Verify the response
    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject({ title: 'test product' });
  });

  it('should perform a DELETE request and return the API response', async () => {
    // Make the DELETE request
    const response: ApiResponse<any> = await apiClient.delete('/products/1');

    // Verify the response
    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject({
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    });
  });
});
