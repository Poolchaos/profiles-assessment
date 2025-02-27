import { Profile } from '../../models/profile';
import { ViewLifecycle } from '../../scripts/lifecycle-base';
import Logger from '../../utils/logger';
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

      // Mutate the existing object to maintain reactivity in the framework
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
      return {};
    }
  }

  public viewProfile(id: string): void {
    Router.navigate(`profile-overview/${id}`);
  }

  public async toggleFavourite(id: string, isFavorite: boolean): Promise<void> {
    try {
      const payload = { profileId: parseInt(id, 10) };
      let response;

      if (isFavorite) {
        response = await httpService.delete<{ additionalProp1: any }>('favorites', payload);
      } else {
        response = await httpService.post<{ additionalProp1: any }>('favorites', payload);
      }

      console.log('Response:', response);

      this.updateProfileFavoriteStatus(id, !isFavorite);
    } catch (error) {
      logger.error('Failed to toggle favorite status', error);
      throw error;
    }
  }

  private updateProfileFavoriteStatus(id: string, newFavoriteStatus: boolean): void {
    const index = this.profiles.findIndex((profile) => profile.id === parseInt(id, 10));
    if (index === -1) {
      logger.error(`Profile with id ${id} not found in profiles array`);
      return;
    }
    const updatedProfile = { ...this.profiles[index], favorite: newFavoriteStatus };
    this.profiles.splice(index, 1, updatedProfile);
  }
}
