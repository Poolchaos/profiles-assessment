import { Profile } from '../../models/profile';
import { ViewLifecycle } from '../../scripts/lifecycle-base';
import Logger from '../../scripts/logger';
import { Router } from '../../scripts/router';
import { httpService } from '../../services/http-service';

import './profiles.scss';

const logger = new Logger('Profiles');

export class Profiles extends ViewLifecycle {
  public profiles: Profile[] = [];

  constructor() {
    super();
    this.profiles = this.makeArrayReactive('profiles', [], 'profile');
  }

  protected async activate(): Promise<void> {
    try {
      const [profiles, favorites] = await Promise.all([this.loadProfiles(), this.loadFavourites()]);
      const favoriteIds = favorites['123456'] || [];

      profiles.forEach((profile) => {
        profile.favorite = favoriteIds.includes(profile.id);
      });

      // Usually done like so
      // this.profiles = profiles;

      // Done like so due to how changes are detected to render repeatable components
      profiles.forEach((profile) => this.profiles.push(profile));
      logger.debug('Profiles loaded and favorites mapped successfully', this.profiles);
    } catch (error) {
      logger.error('Failed to load data', error);
      this.profiles = [];
    }
  }

  private async loadProfiles(): Promise<Profile[]> {
    try {
      const response = await httpService.get<{ profiles: Profile[] }>('profiles');
      return response.profiles;
    } catch (error) {
      logger.error('Failed to load profiles', error);
      throw error;
    }
  }

  private async loadFavourites(): Promise<Record<string, number[]>> {
    try {
      const response = await httpService.get<{ favorites: Record<string, number[]> }>('favorites');
      return response.favorites;
    } catch (error) {
      logger.error('Failed to load favorites', error);
      return {}; // Return empty object if loading fails
    }
  }

  public viewProfile(id: string): void {
    Router.navigate(`profile-overview/${id}`);
  }

  public toggleFavourite(id: string): void {
    console.log(' ::>> toggleFavourite clicked >>>>> ', id);
  }
}
