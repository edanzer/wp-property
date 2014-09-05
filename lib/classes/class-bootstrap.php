<?php
/**
 * Bootstrap
 *
 * @since 2.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\Bootstrap' ) ) {

    final class Bootstrap extends \UsabilityDynamics\WP\Bootstrap {
    
      /**
       * Singleton Instance Reference.
       *
       * @protected
       * @static
       * @property $instance
       * @type \UsabilityDynamics\WPP\Bootstrap object
       */
      protected static $instance = null;
    
      /**
       * Core object
       *
       * @private
       * @static
       * @property $settings
       * @type WPP_Core object
       */
      private $core = null;
      
      /**
       * Instantaite class.
       *
       * @todo: get rid of includes, - move to autoload. peshkov@UD
       */
      public function init() {
        global $wp_properties;
        global $_ud_license_updater;
        
        //** Be sure we do not have errors. Do not initialize plugin if we have them. */
        if( !$this->has_errors() ) {
        
          //** Licenses Manager */
          $this->client = new \UsabilityDynamics\UD_API\Bootstrap( $this->args );
          $_ud_license_updater[ $this->plugin ] = $this->client;
          
          //echo "<pre>"; print_r( $this ); echo "</pre>"; die();
          
          //** Init Settings */
          $this->settings = new Settings( array(
            'key'  => 'wpp_settings',
            'store'  => 'options',
            'data' => array(
              'name' => $this->name,
              'version' => $this->version,
              'domain' => $this->domain,
            )
          ));
        
          /** Defaults filters and hooks */
          include_once WPP_Path . 'default_api.php';
          /** Loads general functions used by WP-Property */
          include_once WPP_Path . 'lib/class_functions.php';
          /** Loads Admin Tools feature */
          include_once WPP_Path . 'lib/class_admin_tools.php';
          /** Loads export functionality */
          include_once WPP_Path . 'lib/class_property_export.php';
          /** Loads all the metaboxes for the property page */
          include_once WPP_Path . 'lib/ui/class_ui.php';
          /** Loads all the metaboxes for the property page */
          include_once WPP_Path . 'lib/class_core.php';
          /** Bring in the RETS library */
          include_once WPP_Path . 'lib/class_rets.php';
          /** Load set of static methods for mail notifications */
          include_once WPP_Path . 'lib/class_mail.php';
          /** Load in hooks that deal with legacy and backwards-compat issues */
          include_once WPP_Path . 'lib/class_legacy.php';
          
          //** Initiate the plugin */
          $this->core = new \WPP_Core();
        
        }
        
      }
      
      /**
       * Define property $schemas here since we can not set correct paths directly in property
       *
       */
      public function define_schemas() {
        $path = WPP_Path . 'static/schemas/';
        $this->schemas = array(
          //** Autoload Classes versions dependencies for Composer Modules */
          'dependencies' => $path . 'schema.dependencies.json',
          //** Plugins Requirements */
          'plugins' => $path . 'schema.plugins.json',
          //** Licenses */
          'licenses' => $path . 'schema.licenses.json',
        );
      }
      
      /**
       * Plugin Activation
       *
       */
      public function activate() {
        global $wp_rewrite;
        //** Do close to nothing because only ran on activation, not updates, as of 3.1 */
        //** Handled by WPP_F::manual_activation(). */
        $wp_rewrite->flush_rules();
      }
      
      /**
       * Plugin Deactivation
       *
       */
      public function deactivate() {
        global $wp_rewrite;
        $wp_rewrite->flush_rules();
      }

    }

  }

}
