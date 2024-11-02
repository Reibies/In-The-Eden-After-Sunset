function appendPCdiv(parentNode){
var lil_pc_div_img = document.createElement("div");
		lil_pc_div_img.setAttribute("class","pc_div");
		lil_pc_div_img.style.setProperty("--lil_pc_x",lil_pc_x);
		lil_pc_div_img.style.setProperty("--lil_pc_y",lil_pc_y);
        
		/*遍历颜色变量 */
		var lil_pc_i;
		function getColor(part, colour){
			for(var i = 0;i < part.length;i ++){
		        if(part[i].variable == colour){
			    	var lil_pc_i = i;
			    };
		    }
		    var result = part[lil_pc_i].canvasfilter.blend;
			return result;
		};
		function getSpecialColor(part, colour){
			var result = "#" + part[colour];
			return result;
		}
		var lil_pc_hair_color = getColor(setup.colours.hair, V.haircolour);
		if(V.makeup.eyelenses.right != 0){
			var lil_pc_righteye_color = getSpecialColor(tinycolor.names, V.makeup.eyelenses.right);
		}
		else{
			var lil_pc_righteye_color = getColor(setup.colours.eyes, V.rightEyeColour);
		}
		if(V.makeup.eyelenses.left != 0){
			var lil_pc_lefteye_color = getSpecialColor(tinycolor.names, V.makeup.eyelenses.left);
		}
		else{
			var lil_pc_lefteye_color = getColor(setup.colours.eyes, V.leftEyeColour);
		}

		function resolveClothColor(wornItem) {
    if (wornItem.colour == "custom") {
        var pc_cloth_hsv = wornItem.colourCustom.match(/\d+(\.\d+)?/g);
        return HSVtoRGB(pc_cloth_hsv[0], pc_cloth_hsv[1] * 78.125, pc_cloth_hsv[2] * 50);
    } else if (wornItem.colour !== 0) {
        return getColor(setup.colours.clothes, wornItem.colour);
    } else if (wornItem.colour == 0 && !wornItem.type.includes("naked") && wornItem.colour_combat !== 0) {
        return getColor(setup.colours.clothes, wornItem.colour_combat);
    } else {
		return getColor(setup.colours.clothes, "black");
	}
    return null;
};

var lil_pc_upper_color = resolveClothColor(V.worn.upper);
var lil_pc_lower_color = resolveClothColor(V.worn.lower);
var lil_pc_feet_color = resolveClothColor(V.worn.feet);


		/*声明插入div的img元素*/
		function createPCimgs(fileName) {
    		var basePath = "img/misc/lil_pc/";
    		var imgElement = document.createElement("img");
    		var className = "pc_img_" + fileName;
    
    		imgElement.setAttribute("src", basePath + pc_direction + "/" + fileName + ".gif");
    		imgElement.setAttribute("class", className);
    		return imgElement;
		};

		var pc_img_body = createPCimgs("body");
		var pc_img_hair = createPCimgs("hair");
		var pc_img_left_eye = createPCimgs("left_eye");
		var pc_img_right_eye = createPCimgs("right_eye");
		var pc_img_shorts = createPCimgs("shorts");
		var pc_img_dress = createPCimgs("dress");
		var pc_img_shirt = createPCimgs("shirt");
		var pc_img_shoes = createPCimgs("shoes");

		/*染色 */


		var pc_all_imgs = [pc_img_body,pc_img_hair,pc_img_left_eye,pc_img_right_eye];

		function createColorCover(element, className, colorProperty, colorValue) {
    		var clone = element.cloneNode();
    		clone.setAttribute("class", className);
    
    		clone.style.setProperty(colorProperty, colorValue);
    		clone.style.setProperty("--pc_width", pc_width);
    		return clone;
		}


		pc_all_imgs.push(createColorCover(pc_img_hair, "pc_img_hair_color_cover", "--pc_img_hair_color", lil_pc_hair_color));
		pc_all_imgs.push(createColorCover(pc_img_left_eye, "pc_img_lefteye_color_cover", "--pc_img_lefteye_color", lil_pc_lefteye_color));
		pc_all_imgs.push(createColorCover(pc_img_right_eye, "pc_img_righteye_color_cover", "--pc_img_righteye_color", lil_pc_righteye_color));

		if (setup.clothes.lower[clothesIndex("lower", V.worn.lower)].skirt == 1 && !V.worn.upper.type.includes("naked")) {
    		pc_all_imgs.push(pc_img_dress, createColorCover(pc_img_dress, "pc_img_shirt_color_cover", "--pc_img_shirt_color", lil_pc_upper_color));
		} 
        else if (!V.worn.lower.type.includes("naked")) {
    		pc_all_imgs.push(pc_img_shorts, createColorCover(pc_img_shorts, "pc_img_shorts_color_cover", "--pc_img_shorts_color", lil_pc_lower_color));
		}


		if (!V.worn.upper.type.includes("naked") && setup.clothes.lower[clothesIndex("lower", V.worn.lower)].skirt != 1) {
    		pc_all_imgs.push(pc_img_shirt, createColorCover(pc_img_shirt, "pc_img_shirt_color_cover", "--pc_img_shirt_color", lil_pc_upper_color));
		}

		if (!V.worn.feet.type.includes("naked")) {
    		pc_all_imgs.push(pc_img_shoes, createColorCover(pc_img_shoes, "pc_img_shoes_color_cover", "--pc_img_shoes_color", lil_pc_feet_color));
		}

		parentNode.appendChild(lil_pc_div_img);
        for(var i =0;i<pc_all_imgs.length;i++){
		    lil_pc_div_img.appendChild(pc_all_imgs[i]);
		};

		var pc_night = document.createElement("img");
		pc_night.setAttribute("class","pc_night");
		pc_night.setAttribute("src",night_img);
		var mask_url = "img/misc/lil_pc/" + pc_direction + "/mask.gif";
        window.modSC2DataManager.getHtmlTagSrcHook().requestImageBySrc(mask_url).then(base64Img => {
            function applyPCNightMask(element, base64Img, div) {
                var base64url = "url(\"" + base64Img + "\")";
                element.style.setProperty("--mask", base64url);
            
                if (Time.hour >= 19 || Time.hour < 8) {
                    div.appendChild(element);
            
                    var totalMinutes = Time.hour * 60 + Time.minute;
                    if (totalMinutes >= 1140 && totalMinutes < 1230) {
                        element.style.setProperty("--eden_night_opacity", eden_night_opacity_night);
                    } else if (totalMinutes >= 360 && totalMinutes < 480) {
                        element.style.setProperty("--eden_night_opacity", eden_night_opacity_morning);
                    } else {
                        element.style.setProperty("--eden_night_opacity", 1);
                    }
                }
            };
            applyPCNightMask(pc_night, base64Img, lil_pc_div_img);
        });}