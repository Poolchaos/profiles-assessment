import Logger from '../utils/logger';

const logger = new Logger('DeviceDetection');

export class DeviceDetection {
  public static isMobile: boolean;

  public static detectDevice(): void {
    const mobileKeywords = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    DeviceDetection.isMobile = mobileKeywords.test(navigator.userAgent);
    logger.debug(`Device is mobile: ${DeviceDetection.isMobile}`);
  }
}
