import { Component, HostListener, OnInit } from '@angular/core';
import { ItemService } from './item.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/*-
 - Root component for the application.
 - Manages the display, filtering, and sorting of items with pagination and infinite scrolling.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AppComponent implements OnInit {
  // Array to hold the fetched items
  items: any[] = [];
  // Array to hold items after applying the filter
  filteredItems: any[] = [];
  // Value used for filtering items
  filterValue = '';
  // Direction of sorting ('asc' or 'desc')
  sortDirection = 'asc';
  // Current page number for pagination
  page = 1;
  // Number of items per page
  pageSize = 10;
  // Flag to indicate if data is currently being loaded
  isLoading = false;
  // Flag to indicate if there are more items to load
  hasMoreItems = true;
  // Title for the component or application
  title: any;

  /*
   - Constructor to inject the ItemService.
   - @param itemService - Service to fetch items from the API.
   */
  constructor(private itemService: ItemService) {}

  /*
   - Lifecycle hook to initialize the component.
   - Loads the initial set of items when the component is initialized.
   */
  ngOnInit() {
    this.loadItems();
  }

  /*
   - Event listener for the window scroll event.
   - Triggers loading more items when the user scrolls near the bottom of the page.
   - @param event - The scroll event.
   */
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    // Calculate the scroll position
    const scrollTop = (event.target as HTMLElement).scrollTop;
    const scrollHeight = (event.target as HTMLElement).scrollHeight;
    const clientHeight = (event.target as HTMLElement).clientHeight;

    // Check if near the bottom of the page
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      this.loadItems();
    }
  }

  /*
   - Fetches items from the ItemService and handles pagination.
   - Appends new items to the existing list and updates the filtered items.
   */
  loadItems() {
    // Prevent loading if already in progress or no more items to load
    if (this.isLoading || !this.hasMoreItems) return;

    this.isLoading = true;

    // Fetch items from the service
    this.itemService.getItems(this.page, this.pageSize).subscribe((data) => {
      this.isLoading = false;
      if (data.length > 0) {
        // Append new items to the list
        this.items = [...this.items, ...data];
        this.filteredItems = [...this.items];
        this.page++; // Move to the next page
      } else {
        // No more items to load
        this.hasMoreItems = false;
      }
    });
  }

  /*
   - Filters items based on the filter value.
   - Updates the filteredItems array with items that match the filter criteria.
   */
  applyFilter() {
    this.filteredItems = this.items.filter((item) =>
      item.title.toLowerCase().includes(this.filterValue.toLowerCase())
    );
  }

  /*
   - Toggles the sorting direction and sorts the filtered items.
   - Sorts items based on their ID.
   */
  toggleSort() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredItems.sort((a, b) => {
      const comparison = a.id - b.id;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
}
