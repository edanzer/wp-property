<?php
/**
 * Lookup Widget
 *
 */
class FeaturedPropertiesWidget extends WP_Widget {

  /**
   * constructor
   */
  function FeaturedPropertiesWidget() {
    parent::WP_Widget( false, $name = sprintf( __( 'Featured %1s', 'wpp' ), WPP_F::property_label( 'plural' ) ), array( 'description' => sprintf( __( 'List of %1s that were marked as Featured', 'wpp' ), WPP_F::property_label( 'plural' ) ) ) );
  }

  /**
   * @see WP_Widget::widget
   *
   */
  function widget( $args, $instance ) {
    $before_widget = '';
    $before_title = '';
    $after_title = '';
    $after_widget = '';
    global $wp_properties;
    extract( $args );
    $title = apply_filters( 'widget_title', $instance[ 'title' ] );
    $instance = apply_filters( 'FeaturedPropertiesWidget', $instance );
    $show_title = $instance[ 'show_title' ];
    $image_type = $instance[ 'image_type' ];
    $amount_items = $instance[ 'amount_items' ];
    $stats = $instance[ 'stats' ];
    $address_format = $instance[ 'address_format' ];
    $hide_image = $instance[ 'hide_image' ];
    $amount_items = $instance[ 'amount_items' ];
    $random_items = $instance[ 'random_items' ];
    $property_stats = $wp_properties[ 'property_stats' ];

    if ( empty( $address_format ) ) {
      $address_format = "[street_number] [street_name], [city], [state]";
    }
    if ( !$image_type ) {
      $image_type = '';
    } else {
      $image_size = WPP_F::image_sizes( $image_type );
    }

    if ( !isset( $property_stats[ 'property_type' ] ) ) {
      $property_stats[ 'property_type' ] = sprintf(__( '%1s Type', 'wpp' ), WPP_F::property_label( 'singular' ) );
    }

    $random_sort = $random_items == 1 ? '&sort_by=random' : '';
    $all_featured = WPP_F::get_properties( "featured=true&property_type=all&pagi=0--{$amount_items}{$random_sort}" );

    /** Bail out if no children */
    if ( !$all_featured ) {
      return;
    }

    //** The current widget can be used on the page twice. So ID of the current DOM element (widget) has to be unique */
    /*
    //Removed since this will cause problems with jQuery Tabs in Denali.
    $before_widget = preg_replace('/id="([^\s]*)"/', 'id="$1_'.rand().'"', $before_widget);
    //*/

    echo $before_widget;
    echo "<div class='wpp_featured_properties_widget'>";

    if ( $title ) {
      echo $before_title . $title . $after_title;
    }

    $count = 0;

    foreach ( $all_featured as $featured ) {
      if ( $amount_items == $count ) {
        continue;
      }
      $count++;
      $this_property = WPP_F::get_property( $featured, 'return_object=true' );
      $image = wpp_get_image_link( $this_property->featured_image, $image_type, array( 'return' => 'array' ) );
      $width = ( !empty( $image_size[ 'width' ] ) ? $image_size[ 'width' ] : ( !empty( $image[ 'width' ] ) ? $image[ 'width' ] : '' ) );
      $height = ( !empty( $image_size[ 'height' ] ) ? $image_size[ 'height' ] : ( !empty( $image[ 'height' ] ) ? $image[ 'height' ] : '' ) );
      ?>
      <div class="property_widget_block  clearfix"
        style="<?php echo( $width ? 'width: ' . ( $width + 5 ) . 'px;' : '' ); ?> min-height: <?php echo $height; ?>px;">
        <?php if ( $hide_image !== 'on' ): ?>
          <?php if ( !empty( $image ) ) : ?>
            <a class="sidebar_property_thumbnail thumbnail" href="<?php echo $this_property->permalink; ?>"><img
                width="<?php echo $image[ 'width' ]; ?>" height="<?php echo $image[ 'height' ]; ?>"
                src="<?php echo $image[ 'link' ]; ?>"
                alt="<?php echo sprintf( __( '%s at %s for %s', 'wpp' ), $this_property->post_title, $this_property->location, $this_property->price ); ?>"/></a>
          <?php else : ?>
            <div class="wpp_no_image" style="width:<?php echo $width; ?>px;height:<?php echo $height; ?>px;"></div>
          <?php endif; ?>
        <?php endif; ?>

        <?php if ( $show_title == 'on' ): ?>
          <p class="title"><a
              href="<?php echo $this_property->permalink; ?>"><?php echo $this_property->post_title; ?></a></p>
        <?php endif; ?>

        <ul class="wpp_widget_attribute_list">
          <?php if ( is_array( $stats ) ): ?>
            <?php foreach ( $stats as $stat ):
              $pstat = $stat;
              /** Determine if stat is property_type we switch it to property_type_label */
              if ( $pstat == 'property_type' ) {
                $pstat = 'property_type_label';
              }
              $content = nl2br( apply_filters( "wpp_stat_filter_{$pstat}", $this_property->$pstat ) );
              if ( empty( $content ) ) {
                continue;
              }
              ?>
              <li class="<?php echo $stat ?>"><span class='attribute'><?php echo $property_stats[ $stat ]; ?>:</span>
                <span class='value'><?php echo $content; ?></span></li>
            <?php endforeach; ?>
          <?php endif; ?>
        </ul>
        <?php if ( $instance[ 'enable_more' ] == 'on' ) : ?>
          <p class="more"><a href="<?php echo $this_property->permalink; ?>"
              class="btn btn-info"><?php _e( 'More', 'wpp' ); ?></a></p>
        <?php endif; ?>
      </div>
      <?php
      unset( $this_property );
    }
    if ( $instance[ 'enable_view_all' ] == 'on' ) {
      echo '<p class="view-all"><a href="' . site_url() . '/' . $wp_properties[ 'configuration' ][ 'base_slug' ] . '" class="btn btn-large">' . __( 'View All', 'wpp' ) . '</a></p>';
    }
    echo '<div class="clear"></div>';
    echo '</div>';
    echo $after_widget;
  }

  /**
   * @see WP_Widget::update
   */
  function update( $new_instance, $old_instance ) {
    return $new_instance;
  }

  /**
   * @see WP_Widget::form
   */
  function form( $instance ) {
    global $wp_properties;
    $title = esc_attr( $instance[ 'title' ] );
    $image_type = esc_attr( $instance[ 'image_type' ] );
    $amount_items = esc_attr( $instance[ 'amount_items' ] );
    $instance_stats = $instance[ 'stats' ];
    $show_title = $instance[ 'show_title' ];
    $hide_image = $instance[ 'hide_image' ];
    $address_format = esc_attr( $instance[ 'address_format' ] );
    $enable_more = $instance[ 'enable_more' ];
    $enable_view_all = $instance[ 'enable_view_all' ];
    $random_items = $instance[ 'random_items' ];
    $property_stats = $wp_properties[ 'property_stats' ];

    if ( empty( $address_format ) ) {
      $address_format = "[street_number] [street_name],[city], [state]";
    }

    if ( !isset( $property_stats[ 'property_type' ] ) ) {
      $property_stats[ 'property_type' ] = sprintf( __( '%1s Type', 'wpp' ), WPP_F::property_label( 'singular' ) );
    }
    ?>
    <script type="text/javascript">
      //hide and show dropdown whith thumb settings
      jQuery( document ).ready( function ( $ ) {
        jQuery( 'input.check_me_featured' ).change( function () {
          if ( jQuery( this ).attr( 'checked' ) !== true ) {
            jQuery( 'p#choose_thumb_featured' ).css( 'display', 'block' );
          } else {
            jQuery( 'p#choose_thumb_featured' ).css( 'display', 'none' );
          }
        } );
      } );
    </script>
    <p>
      <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:', 'wpp' ); ?>
        <input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>"
          name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo $title; ?>"/>
      </label>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id( 'hide_image' ); ?>">
        <input id="<?php echo $this->get_field_id( 'hide_image' ); ?>" class="check_me_featured"
          name="<?php echo $this->get_field_name( 'hide_image' ); ?>" type="checkbox"
          value="on" <?php if ( $hide_image == 'on' ) echo " checked='checked';"; ?> />
        <?php _e( 'Hide Images?', 'wpp' ); ?>
      </label>
    </p>
    <p
      id="choose_thumb_featured" <?php echo( $hide_image !== 'on' ? 'style="display:block;"' : 'style="display:none;"' ); ?>>
      <label for="<?php echo $this->get_field_id( 'image_type' ); ?>"><?php _e( 'Image Size:', 'wpp' ); ?>
        <?php WPP_F::image_sizes_dropdown( "name=" . $this->get_field_name( 'image_type' ) . "&selected=" . $image_type ); ?>
      </label>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id( 'amount_items' ); ?>"><?php _e( 'Listings to display?', 'wpp' ); ?>
        <input style="width:30px" id="<?php echo $this->get_field_id( 'amount_items' ); ?>"
          name="<?php echo $this->get_field_name( 'amount_items' ); ?>" type="text"
          value="<?php echo ( empty( $amount_items ) ) ? 5 : $amount_items; ?>"/>
      </label>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id( 'random_items' ); ?>">
        <input id="<?php echo $this->get_field_id( 'random_items' ); ?>"
          name="<?php echo $this->get_field_name( 'random_items' ); ?>" type="checkbox"
          value="1" <?php if ( !empty( $random_items ) ) echo ' checked="checked"'; ?> />
        <?php _e( 'Display properties in random order?', 'wpp' ); ?>
      </label>
    </p>
    <p><?php _e( 'Select the stats you want to display', 'wpp' ) ?></p>
    <p>
      <label for="<?php echo $this->get_field_id( 'show_title' ); ?>">
        <input id="<?php echo $this->get_field_id( 'show_title' ); ?>"
          name="<?php echo $this->get_field_name( 'show_title' ); ?>" type="checkbox"
          value="on" <?php if ( $show_title == 'on' ) echo " checked='checked';"; ?> />
        <?php _e( 'Title', 'wpp' ); ?>
      </label>
      <?php foreach ( $property_stats as $stat => $label ): ?>
        <br/>
        <label for="<?php echo $this->get_field_id( 'stats' ); ?>_<?php echo $stat; ?>">
          <input id="<?php echo $this->get_field_id( 'stats' ); ?>_<?php echo $stat; ?>"
            name="<?php echo $this->get_field_name( 'stats' ); ?>[]" type="checkbox" value="<?php echo $stat; ?>"
          <?php if ( is_array( $instance_stats ) && in_array( $stat, $instance_stats ) ) echo " checked "; ?>">
          <?php echo $label; ?>
        </label>
      <?php endforeach; ?>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id( 'address_format' ); ?>"><?php _e( 'Address Format:', 'wpp' ); ?>
        <textarea style="width: 100%" id="<?php echo $this->get_field_id( 'address_format' ); ?>"
          name="<?php echo $this->get_field_name( 'address_format' ); ?>"><?php echo $address_format; ?></textarea>
      </label>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id( 'enable_more' ); ?>">
        <input id="<?php echo $this->get_field_id( 'enable_more' ); ?>"
          name="<?php echo $this->get_field_name( 'enable_more' ); ?>" type="checkbox"
          value="on" <?php if ( $enable_more == 'on' ) echo " checked='checked';"; ?> />
        <?php _e( 'Show "More" link?', 'wpp' ); ?>
      </label>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id( 'enable_view_all' ); ?>">
        <input id="<?php echo $this->get_field_id( 'enable_view_all' ); ?>"
          name="<?php echo $this->get_field_name( 'enable_view_all' ); ?>" type="checkbox"
          value="on" <?php if ( $enable_view_all == 'on' ) echo " checked='checked';"; ?> />
        <?php _e( 'Show "View All" link?', 'wpp' ); ?>
      </label>
    </p>
  <?php
  }

}