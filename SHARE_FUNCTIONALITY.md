# Tarot Share Functionality

This document describes the comprehensive share functionality implemented for the Tarot Daily application.

## Overview

The share functionality allows users to share their completed tarot readings with others through various social media platforms and direct links. When a deck is fully revealed, a "Share Reading" button appears that opens a modal with multiple sharing options.

## Features

### 1. Share Button
- Appears only when all three cards are revealed
- Located below the "Draw Again" button
- Styled as a secondary button to complement the primary "Draw Again" button

### 2. Share Modal
The share modal displays:
- **Header**: "Share Reading" title with close button
- **Preview Section**: Shows the reading type, date, and all three cards with their names and positions
- **Share Options**: Multiple social media platforms and copy link functionality

### 3. Social Media Integration
- **Telegram**: Opens Telegram share dialog with pre-filled text
- **Facebook**: Opens Facebook share dialog
- **Twitter**: Opens Twitter share dialog with pre-filled text
- **Instagram**: Copies link and shows instructions (Instagram doesn't support direct link sharing)
- **Copy Link**: Copies the shareable URL to clipboard

### 4. Shareable URLs
- Generated URLs follow the pattern: `/share/[encoded-data]`
- Data is base64 encoded and includes:
  - Card IDs and positions
  - Reading type (Love, Career, Destiny, or General)
  - Date of the reading
- URLs are shareable and can be opened in any browser

### 5. Shared Reading View
When someone opens a shared link, they see:
- A dedicated page showing the shared reading
- All three cards revealed with their meanings
- Reading type and date information
- Option to draw their own cards
- Same styling and layout as the main application

## Technical Implementation

### Components

1. **ShareModal** (`src/components/ShareModal.tsx`)
   - Handles the share modal display and interactions
   - Manages social media sharing and link copying
   - Includes card preview with images

2. **SharedDeck** (`src/components/SharedDeck.tsx`)
   - Displays shared readings for guests
   - Shows cards in their revealed state
   - Provides navigation back to main application

3. **Share Page** (`src/app/share/[data]/page.tsx`)
   - Dynamic route for shared readings
   - Decodes and validates shared data
   - Renders the SharedDeck component

### Data Flow

1. User completes a reading (all cards revealed)
2. "Share Reading" button appears
3. Clicking opens ShareModal with reading data
4. User selects sharing method
5. Share data is encoded and URL is generated
6. URL can be shared via social media or copied
7. Recipients can open URL to view shared reading

### URL Structure

```
/share/[url-safe-base64-encoded-json]
```

The data is encoded using URL-safe base64 encoding to ensure compatibility with web URLs:
- `+` characters are replaced with `-`
- `/` characters are replaced with `_`
- `=` padding characters are removed

Example encoded data structure:
```json
{
  "cards": [
    {
      "id": "major_00_the_fool",
      "name": "The Fool",
      "position": "upright"
    }
  ],
  "readingType": "Love",
  "date": "December 15, 2024"
}
```

**Example URL:**
```
http://localhost:3000/share/eyJjYXJkcyI6W3siaWQiOiJtYWpvcl8wMF90aGVfZm9vbCIsIm5hbWUiOiJUaGUgRm9vbCIsInBvc2l0aW9uIjoidXByaWdodCJ9XSwicmVhZGluZ1R5cGUiOiJMb3ZlIiwiZGF0ZSI6IkRlY2VtYmVyIDE1LCAyMDI0In0
```

### Styling

- Share modal uses the same design system as the main application
- Responsive design for mobile and desktop
- Hover effects and animations for better user experience
- Social media platform-specific color schemes

## Usage

### For Users
1. Complete a tarot reading by revealing all three cards
2. Click "Share Reading" button
3. Choose sharing method from the modal
4. Share with friends via social media or direct link

### For Recipients
1. Click on shared link
2. View the shared reading with all cards revealed
3. See card meanings and positions
4. Option to draw their own cards

## Analytics

The share functionality includes analytics tracking for:
- Share button clicks
- Social media platform usage
- Link copying
- Shared reading views

## Internationalization

The share functionality supports both English and Ukrainian languages with appropriate translations for all text elements.

## Browser Compatibility

- Modern browsers with ES6+ support
- Mobile-responsive design
- Touch-friendly interactions
- Accessible keyboard navigation

## Security Considerations

- Shared data is encoded, not encrypted
- No sensitive user information is shared
- URLs contain only public reading data
- No authentication required to view shared readings

## Error Handling

The share functionality includes comprehensive error handling:

### Encoding Errors
- JSON serialization failures are caught and logged
- Invalid data structures are prevented
- Fallback handling when share data generation fails

### Decoding Errors
- Invalid URL parameters are detected and rejected
- Malformed base64 data is handled gracefully
- JSON parsing errors are caught with helpful messages
- Missing or corrupted card data is validated

### User Experience
- Clear error messages for failed shares
- Graceful fallbacks when operations fail
- Loading states for better user feedback
- Validation of shared data integrity

### Common Error Scenarios
- **"Reading Not Found"**: Invalid or corrupted share URL
- **"Invalid share data format"**: Malformed URL parameters
- **"Failed to decode share data"**: Base64 encoding issues
- **"Failed to parse share data"**: JSON format problems
- **"Card not found"**: Missing card data in deck
- **"Card data incomplete"**: Incomplete card information
