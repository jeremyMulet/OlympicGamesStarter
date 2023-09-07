import {Component, Input} from '@angular/core';

/**
 * Header Component
 *
 * @Description:
 * The Header component acts as the primary navigation and informational bar at the top
 * of the application. It ensures consistent branding, provides quick access to the main
 * parts of the application, and displays key statistics to the user.
 *
 * @Inputs:
 * - pageTitle: A string input representing the title of the current page.
 * - pageInfos: An array of objects containing key-value pairs for statistics.
 *   Example format: [{ label: 'Total Medal', value: 205 }, ...]
 *
 * @author Jérémy Mulet
 */
@Component({
    selector: 'app-header', templateUrl: './header.component.html', styleUrls: ['./header.component.scss']
})
export class HeaderComponent{
    @Input() pageTitle?: string;
    @Input() pageInfos!: { label: string, value: number }[];
}
