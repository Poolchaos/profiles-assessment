import { MOCK_PROFILE } from './../../../_mocks_/mock-profile';
import { Profile } from '../../models/profile';
import { ViewLifecycle } from '../../scripts/lifecycle-base';
import Logger from '../../utils/logger';
import { httpService } from '../../services/http-service';
import { Router } from '../../scripts/router';

import './profile-overview.scss';

const logger = new Logger('ProfileOverview');

export class ProfileOverview extends ViewLifecycle {
  public user: Profile | { [key: string]: any } = {};
  protected _viewModelId: string;
  public isMobile = window.matchMedia('(max-width: 768px)').matches;

  constructor() {
    super();
    this.user = super.makeObjectReactive('user', {});
  }

  protected async activate(): Promise<void> {
    const profileId = Router.getCurrentParams().id;
    const currentUserId = this.getCurrentUserId();
    try {
      const [profile, favorites] = await Promise.all([this.loadProfile(profileId), this.loadFavourites()]);
      const favoriteIds = favorites[currentUserId] || [];
      const isFavorite = favoriteIds.includes(profile.id);
      // Mutate the existing object to maintain reactivity in the framework
      Object.assign(this.user, {
        ...profile,
        ...MOCK_PROFILE,
        favorite: isFavorite,
      });
    } catch (error) {
      logger.error('Failed to load data', error);
      this.user = null;
    }
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  protected deactivate() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    super.reRenderTemplate();
  }

  private async loadProfile(id: string): Promise<Profile> {
    try {
      const response = await httpService.get<Profile>(`profiles/${id}`);
      return response;
    } catch (error) {
      logger.error('Failed to load profile', error);
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

  public navigateToProfiles(): void {
    Router.navigate(`profiles`);
  }

  public async toggleFavourite(): Promise<void> {
    try {
      const payload = { profileId: this.user.id };
      let response;

      if (this.user.favorite) {
        response = await httpService.delete<{ additionalProp1: any }>('favorites', payload);
      } else {
        response = await httpService.post<{ additionalProp1: any }>('favorites', payload);
      }

      // Mutate the existing object to maintain reactivity in the framework
      Object.assign(this.user, {
        favorite: !this.user.favorite,
      });
    } catch (error) {
      logger.error('Failed to toggle favorite status', error);
      throw error;
    }
  }

  private getCurrentUserId(): string {
    return '123456';
  }
}
