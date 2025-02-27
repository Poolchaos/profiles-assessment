import { MOCK_PROFILE } from './../../../_mocks_/mock-profile';
import { Profile } from '../../models/profile';
import { ViewLifecycle } from '../../scripts/lifecycle-base';
import Logger from '../../scripts/logger';
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

  protected activate(): void {
    const profileId = Router.getCurrentParams().id;
    this.loadProfile(profileId);
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  protected deactivate() {
    console.log(' ::>> remove ');
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    super.reRenderTemplate();
  }

  private async loadProfile(id: string): Promise<void> {
    try {
      const response = await httpService.get<Profile>(`profiles/${id}`);
      console.log(' ::>> response >>>>> ', response);
      Object.assign(this.user, {
        ...response,
        ...MOCK_PROFILE,
      });
    } catch (error) {
      logger.error('Failed to load profile', error);
      this.user = null;
    }
  }

  public navigateToProfiles(): void {
    console.log(' ::>> navigateToProfiles >>>> ');
    Router.navigate(`profiles`);
  }
}
