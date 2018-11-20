<div class="share <? if ($options["show_share_bar"] == "yes") echo "responsive_share_bar"?>">
	<?	
	global $Meta;
	$commentUrl = $Meta->Cannonical;
	if($options["customUrl"] != null)
	{
		$commentUrl = $options["customUrl"];
		
		if(strpos($commentUrl, 'http://') === false)
		{
			$commentUrl = "http://".$commentUrl;
		}
	}
	
	if($options["show_native_comment_form"] == "yes")
	{
		?><div class="native_comment"><?
		$userComentario = wp_get_current_user();
		if(!$userComentario->exists())
		{			
			$userNotLogged = '<span id="user_not_logged"></span>';			
		}	
		$native_comment_title = "Escreva um comentário";
		if($options["native_comment_title"] != null)
		{
			$native_comment_title = $options["native_comment_title"];
		}
		$comments_args = array(	//todo not outputting comment form							 
			'label_submit'=>'Enviar',							
			'title_reply'=>$native_comment_title,
			'must_log_in'=>'Você deve fazer <a class="loggin" href="/admin">login</a> ou criar uma conta para comentar',
			// remove "Text or HTML to be displayed after the set of comment fields"
			'comment_notes_after' => '',								
			'comment_field' => '
			<p class="comment-form-comment">'
				.$userNotLogged.
				'<input id="parentId" type="hidden" value="'.$options["parentId"].'"/>
				<label for="comment">' . _x( 'Comment', 'noun' ) . '</label><br />
				<textarea placeholder="escreva seu texto" id="comment" name="comment" aria-required="true"></textarea>
			</p>',
			);	
		comment_form($comments_args, $options["parentId"]);	
		
		?></div><?					
	}	
	
	if($options["hideShareBtns"] != true && !is_fam_mobile() && $options["show_share_bar"] != "yes") 
	{?>		
		<div class="google_plus">
			<g:plusone width="200" size="medium" action="share" annotation="bubble" href="<? echo $commentUrl;?>"></g:plusone>			
		</div>
						
		<div class="fb-like" data-send="<? echo $options["send"];?>" layout="<?echo $options["layout"];?>" data-href="<? echo $commentUrl;?>" data-width="400" data-show-faces="<?if ($options["showface"] != null) {echo $options["showface"];} else {echo "true";}?>"></div>		
	<? 		
	}	
	
	
	
	if($options["show_share_bar"] == "yes" || is_fam_mobile())
	{
		global $Meta;		
		
		?>
			<div class="share-bar__container">
				<div class="share-bar share-bar-container share-theme-natural" data-title="Vídeo mostra dimensões de caverna descoberta no maior presídio do RN" data-url="<?echo $commentUrl ?>" data-image-url="<? echo $Meta->ImgSrc;?>" data-hashtags="#fazendoasmalas">
	
					<div class="share-button share-facebook <? if ($options["share_full"] == "yes") echo "share-full"; ?>">
						<a class="share-popup" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=<?echo $commentUrl ?>" title="Compartilhar via Facebook">
							<div class="svg-size">      
								<svg viewBox="0 0 100 100" class="share-icon">           
									<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-facebook">
									</use>       
								</svg>   
							</div>
							<span>Facebook</span>
						</a>
					</div>
					<div class="share-button share-twitter <? if ($options["share_full"] == "yes") echo "share-full"; ?>">
						<a class="share-popup" target="_blank" href="https://twitter.com/share?url=<?echo $commentUrl ?>" title="Compartilhar via Twitter">   
							<div class="svg-size">
								<svg viewBox="0 0 100 100" class="share-icon">           
									<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-twitter">
									</use>       
								</svg>   
							</div>
							<span>Twitter</span>
							</a>
					</div>
					<? if(is_fam_mobile()){ ?>
					<div class="share-button share-whatsapp <? if ($options["share_full"] == "yes") echo "share-full"; ?>">
						<a class="share-popup" target="_blank" href="whatsapp://send?text=<? echo $Meta->Title; ?>%20<?echo $commentUrl ?>" title="Compartilhar via Whatsapp">  
							<div class="svg-size">      
								<svg viewBox="0 0 100 100" class="share-icon">           
									<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-whatsapp">
								</use>       
								</svg>   
							</div>
							<span>Whatsapp</span>
						</a>
					</div>
					<? } ?>
					<div class="share-button share-googleplus <? if ($options["share_full"] == "yes") echo "share-full"; ?>">
						<a class="share-popup"  target="_blank" href="https://plus.google.com/share?url=<?echo $commentUrl ?>" title="Compartilhar via Google+">  
							<div class="svg-size">      
								<svg viewBox="0 0 100 100" class="share-icon">           
									<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-googleplus"></use>       
								</svg>  
							</div>
							<span>Google+</span>
						</a>
					</div>
					<div class="share-button share-pinterest <? if ($options["share_full"] == "yes") echo "share-full"; ?>">
						<a class="share-popup"  target="_blank" href="http://www.pinterest.com/pin/create/button/?url=<?echo $commentUrl ?>&amp;media=<? echo $Meta->ImgSrc;?>&amp;description=<? echo $Meta->Title; ?>" title="Compartilhar via Pinterest">   
							<div class="svg-size">     
								<svg viewBox="0 0 100 100" class="share-icon">          
									<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-pinterest"></use>       
								</svg>  
							</div>
							<span>Pinterest</span>
						</a>
					</div>
				</div>
			</div>
			<? global $ShareBarLoaded; if($ShareBarLoaded == null) {$ShareBarLoaded = true;?>	
			<div style="display: none;">
				<svg xmlns="http://www.w3.org/2000/svg"><symbol viewBox="0 0 500 500" id="icon-email">
				<title>email</title>
				<path d="M1.37 386.854c0 27.48 22.257 49.766 49.728 49.766H449.29c27.473 0 49.73-22.283 49.73-49.766v-248.87s-12.964 10.14-199.146 148.416c-28.297 17.07-69.558 17.46-99.372-.243-181.93-135.1-199.12-148.16-199.12-148.16l-.013 248.857zm228.098-157.947c9.294 5.564 32.148 5.76 41.844 0 97.806-70.98 116.88-85.534 209.17-154.526-7.62-6.742-19.38-11-31.19-11H51.098c-11.883 0-22.793 4.173-31.347 11.136 102.4 74.878 111.524 81.56 209.718 154.39z"></path></symbol><symbol viewBox="0 0 500 500" id="icon-facebook"><title>facebook</title>
				<path id="svgstoreeb06781e16b6b900d678925df65cf12eWhite_2_" d="M471.38 1.153H28.62c-15.173 0-27.47 12.296-27.47 27.47v442.756c0 15.167 12.297 27.468 27.47 27.468h238.365V306.113H202.13v-75.11h64.857v-55.394c0-64.284 39.262-99.288 96.607-99.288 27.47 0 51.076 2.045 57.957 2.96v67.18l-39.77.017c-31.188 0-37.227 14.82-37.227 36.566v47.956h74.38l-9.685 75.11h-64.695v192.735H471.38c15.167 0 27.468-12.3 27.468-27.47V28.623c0-15.173-12.3-27.47-27.47-27.47z"></path></symbol><symbol viewBox="0 0 500 500" id="icon-googleplus"><title>googleplus</title>
				<path fill-rule="evenodd" clip-rule="evenodd" d="M332.72 1.512H185.872c-97.906 0-150.835 45.908-150.835 125.266 0 65.242 60.163 109.498 131.258 99.056-17.323 33.057 1.33 57.072 13.394 69.564-97.457 0-178.005 42.25-178.005 105.626 0 55.68 47.38 97.248 141.948 97.248 102.436 0 174.965-55.934 174.965-123.885 0-23.46-7.442-43.73-25.77-64.51-31.966-36.228-70.958-46.017-70.958-71.557 0-23.24 22.223-34.42 39.962-49.687 27.123-23.333 35.952-53.148 33.884-82.732-2.866-41.054-27.077-65.085-44.215-77.7 15.255.03 37.548.365 37.548.365L332.72 1.512zm-69.605 364.96c26.29 35.767 6.876 103.268-86.362 103.268-52.19 0-116.27-21.067-116.27-80.906 0-70.286 102.02-75.117 140.226-75.117 23.02 16.848 45.868 30.254 62.405 52.754zm-63.977-162.005c-45.116 18.017-81.727-10.47-99.57-68.952-14.48-47.405-3.872-93.318 29.746-105.112 43.718-15.33 79.012 9.32 98.334 62.96 21.46 59.545 6.957 95.006-28.51 111.104zm240.12 9.696v-59.1h-35.42v59.1h-59.204v35.37h59.204v59.607h35.42v-59.608h59.447v-35.37H439.26z"></path></symbol><symbol viewBox="0 0 500 500" id="icon-pinterest"><title>pinterest</title>
				<path d="M250.425 1.195C113.12 1.195 1.805 112.5 1.805 249.81c0 101.8 61.205 189.248 148.813 227.705-.704-17.358-.133-38.19 4.32-57.078 4.784-20.188 32-135.472 32-135.472s-7.95-15.878-7.95-39.33c0-36.855 21.352-64.368 47.948-64.368 22.615 0 33.54 16.982 33.54 37.328 0 22.73-14.493 56.732-21.96 88.22-6.226 26.38 13.232 47.89 39.247 47.89 47.1 0 78.83-60.502 78.83-132.177 0-54.493-36.695-95.28-103.448-95.28-75.42 0-122.398 56.24-122.398 119.066 0 21.656 6.385 36.927 16.388 48.75 4.6 5.438 5.244 7.623 3.57 13.862-1.19 4.577-3.934 15.587-5.063 19.957-1.65 6.288-6.76 8.546-12.442 6.215-34.742-14.178-50.923-52.21-50.923-94.976 0-70.62 59.566-155.308 177.692-155.308 94.914 0 157.382 68.683 157.382 142.416 0 97.526-54.213 170.384-134.137 170.384-26.84 0-52.09-14.494-60.744-30.98 0 0-14.432 57.272-17.48 68.344-5.28 19.167-15.598 38.335-25.03 53.267 22.36 6.59 45.983 10.185 70.467 10.185 137.28 0 248.596-111.304 248.596-248.62C499.02 112.5 387.706 1.194 250.425 1.194z"></path></symbol><symbol viewBox="0 0 500 500" id="icon-twitter"><title>twitter</title>
				<path d="M498.717 96.337c-18.296 8.108-37.96 13.593-58.6 16.056 21.063-12.63 37.24-32.6 44.852-56.426-19.714 11.698-41.545 20.185-64.78 24.76-18.613-19.822-45.125-32.215-74.473-32.215-56.338 0-102.01 45.666-102.01 101.977 0 8 .896 15.78 2.638 23.24-84.795-4.25-159.97-44.842-210.282-106.55-8.784 15.058-13.81 32.584-13.81 51.27 0 35.393 18 66.594 45.382 84.884-16.725-.527-32.457-5.115-46.22-12.758-.006.425-.006.857-.006 1.296 0 49.403 35.174 90.608 81.845 99.972-8.562 2.335-17.574 3.584-26.877 3.584-6.578 0-12.973-.642-19.193-1.822 12.98 40.52 50.65 69.993 95.292 70.815-34.913 27.344-78.897 43.657-126.695 43.657-8.238 0-16.36-.48-24.334-1.424 45.14 28.928 98.772 45.82 156.38 45.82 187.654 0 290.265-155.388 290.265-290.15 0-4.427-.088-8.82-.29-13.204 19.935-14.376 37.232-32.328 50.914-52.783z"></path></symbol><symbol viewBox="0 0 500 500" id="icon-whatsapp"><title>whatsapp</title>
				<path fill-rule="evenodd" clip-rule="evenodd" d="M254.55 1C119.793 1 10.543 109.368 10.543 243.056c0 45.74 12.796 88.506 35.012 124.986L1.514 497.92l135.094-42.91c34.962 19.17 75.16 30.114 117.942 30.114 134.77 0 244.01-108.396 244.01-242.068C498.56 109.368 389.32 1 254.55 1zm0 443.563c-41.254 0-79.675-12.277-111.758-33.32l-78.06 24.793 25.37-74.828c-24.31-33.23-38.68-74.05-38.68-118.152 0-111.108 91.127-201.518 203.13-201.518 112.012 0 203.133 90.41 203.133 201.518 0 111.115-91.122 201.507-203.134 201.507zm114.408-146.5c-6.117-3.32-36.16-19.41-41.797-21.693-5.636-2.26-9.75-3.44-14.135 2.587-4.39 6.018-16.855 19.492-20.633 23.474-3.795 3.994-7.44 4.364-13.562 1.038-6.105-3.314-25.934-10.59-48.928-32.52-17.892-17.06-29.63-37.764-33.038-44.073-3.403-6.315-.022-9.547 3.215-12.493 2.9-2.68 6.502-6.994 9.75-10.49 3.243-3.49 4.385-6.017 6.62-10.077 2.227-4.037 1.333-7.688-.11-10.838-1.446-3.138-12.753-34.008-17.48-46.572-4.72-12.564-9.983-10.69-13.618-10.82-3.635-.145-7.766-.817-11.924-.972-4.147-.15-10.96 1.147-16.9 7.126-5.94 5.956-22.596 20.307-23.743 50.708-1.147 30.406 20.06 60.61 23.016 64.845 2.963 4.236 40.496 70.14 102.876 97.237 62.385 27.087 62.71 18.836 74.16 18.23 11.45-.597 37.417-13.58 43.153-27.81 5.74-14.23 6.198-26.596 4.736-29.237-1.455-2.632-5.548-4.342-11.658-7.65z"></path></symbol>
				</svg>
			</div>	
			<?}			
	}
	if($options["hideCommentBox"] != true)
	{		
		?><fb:comments href="<?echo $commentUrl ?>" notify="true" num_posts="25" width="<? echo $options["comment_box_width"] ?>"></fb:comments><?
	}	
	?>
	
</div>
<div class="clear"></div>



