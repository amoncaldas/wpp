<?php
use WPRemoteMediaExt\RemoteMediaExt\FRemoteMediaExt;

$feature = FRemoteMediaExt::getInstance();?>
<script type="text/html" id="tmpl-media-upload-flickr-upgrade">
  <div class="uploader-inline rm-upload-wrap">
    <div class="uploader-inline-content no-upload-message">
      <div class="upload-ui">
        <h3 class="upload-instructions drop-instructions"><?php _e('Upload files directly to your Flickr account');?></h3>
        <br>
        <a href="https://www.onecodeshop.com/downloads/wordpress-rml-for-flickr-plugin/?utm_source=wp&utm_medium=user_upload&utm_campaign=rml" target="_blank" class="browser button button-hero" id="flickr-pro-link" style="position: relative; z-index: 0; display: inline;"><?php _e('Get the extension and start uploading &raquo;');?></a>
      </div>
      <p class="no-mg-top"><strong><?php _e('Add our remote media pro extension for Flickr to unlock premium features.', 'remote-medias-lite'); ?></strong></p>
      <p class="ocs-logo"><img width="165px" src="<?php echo $feature->getAssetsUrl().'img';?>/logo-dev.png" alt="One Code Shop" /></p>
    </div>
  </div>

</script>