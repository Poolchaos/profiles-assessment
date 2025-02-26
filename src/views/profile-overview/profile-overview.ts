import { Profile } from '../../models/profile';
import { ViewLifecycle } from '../../scripts/lifecycle-base';
import Logger from '../../scripts/logger';
import { httpService } from '../../services/http-service';
import { Router } from '../../scripts/router';

import './profile-overview.scss';

const logger = new Logger('ProfileOverview');

export class ProfileOverview extends ViewLifecycle {
  public user: Profile | null = null;

  constructor() {
    super();
  }

  protected activate(): void {
    const profileId = Router.getCurrentParams().id;
    this.loadProfile(profileId);
  }

  private async loadProfile(id: string): Promise<void> {
    try {
      const response = await httpService.get<Profile>(`profiles/${id}`);
      this.user = response;
      logger.debug('Profile loaded successfully', this.user);
    } catch (error) {
      logger.error('Failed to load profile', error);
      this.user = null;
    }
  }
}
