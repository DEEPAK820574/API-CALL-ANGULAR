import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/*
 - Service to handle API operations related to items.
 - This service interacts with a public API to fetch and manage items.
 */
@Injectable({
  providedIn: 'root',
})

export class ItemService {
  // Base URL for the API endpoint
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  /*
   - Constructor to inject the HttpClient service.
   - @param http - HttpClient instance to make HTTP requests.
   */

  constructor(private http: HttpClient) {}

  /*
   - Fetches a paginated list of items from the API.
   - @param page - The current page number to fetch.
   - @param pageSize - The number of items per page.
   - @returns An Observable containing an array of items.
   */

  getItems(page: number, pageSize: number): Observable<any[]> {
    // Construct query parameters for pagination
    const params = new HttpParams()
      .set('page', page.toString())
      // Use 'limit' to control the number of items per page
      .set('limit', pageSize.toString());

    // Perform the HTTP GET request with the specified parameters
    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
