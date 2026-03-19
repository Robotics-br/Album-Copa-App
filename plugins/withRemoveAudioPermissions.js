const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withRemoveAudioPermissions(config) {
  return withAndroidManifest(config, async (config) => {
    let androidManifest = config.modResults.manifest;

    // Ensure tools namespace exists
    if (!androidManifest.$['xmlns:tools']) {
      androidManifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    if (!androidManifest['uses-permission']) {
      androidManifest['uses-permission'] = [];
    }

    const permissionsToRemove = [
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
      'android.permission.FOREGROUND_SERVICE_MICROPHONE',
      'android.permission.RECORD_AUDIO',
      'android.permission.MODIFY_AUDIO_SETTINGS',
    ];

    permissionsToRemove.forEach((permissionName) => {
      const existingPerm = androidManifest['uses-permission'].find(
        (p) => p.$['android:name'] === permissionName
      );
      if (existingPerm) {
        existingPerm.$['tools:node'] = 'remove';
      } else {
        androidManifest['uses-permission'].push({
          $: {
            'android:name': permissionName,
            'tools:node': 'remove',
          },
        });
      }
    });

    // Also remove the services to be safe
    if (!androidManifest.application) {
      androidManifest.application = [{}];
    }
    const app = androidManifest.application[0];
    if (!app.service) {
      app.service = [];
    }

    const servicesToRemove = [
      'expo.modules.audio.service.AudioControlsService',
      'expo.modules.audio.service.AudioRecordingService',
    ];

    servicesToRemove.forEach((serviceName) => {
      const existingService = app.service.find((s) => s.$['android:name'] === serviceName);
      if (existingService) {
        existingService.$['tools:node'] = 'remove';
      } else {
        app.service.push({
          $: {
            'android:name': serviceName,
            'tools:node': 'remove',
          },
        });
      }
    });

    return config;
  });
};
