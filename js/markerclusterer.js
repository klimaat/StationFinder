function MarkerClusterer(a, b, c) {
	this.extend(MarkerClusterer, google.maps.OverlayView),
		(this.map_ = a),
		(this.markers_ = []),
		(this.clusters_ = []),
		(this.sizes = [53, 56, 66, 78, 90]),
		(this.styles_ = []),
		(this.ready_ = !1);
	var d = c || {};
	(this.gridSize_ = d.gridSize || 60),
		(this.minClusterSize_ = d.minimumClusterSize || 2),
		(this.maxZoom_ = d.maxZoom || null),
		(this.styles_ = d.styles || []),
		(this.imagePath_ = d.imagePath || this.MARKER_CLUSTER_IMAGE_PATH_),
		(this.imageExtension_ =
			d.imageExtension || this.MARKER_CLUSTER_IMAGE_EXTENSION_),
		(this.zoomOnClick_ = !0),
		void 0 != d.zoomOnClick && (this.zoomOnClick_ = d.zoomOnClick),
		(this.averageCenter_ = !1),
		void 0 != d.averageCenter && (this.averageCenter_ = d.averageCenter),
		this.setupStyles_(),
		this.setMap(a),
		(this.prevZoom_ = this.map_.getZoom());
	var e = this;
	google.maps.event.addListener(this.map_, "zoom_changed", function () {
		var a = e.map_.mapTypes[e.map_.getMapTypeId()].maxZoom,
			b = e.map_.getZoom();
		b < 0 ||
			b > a ||
			(e.prevZoom_ != b &&
				((e.prevZoom_ = e.map_.getZoom()), e.resetViewport()));
	}),
		google.maps.event.addListener(this.map_, "idle", function () {
			e.redraw();
		}),
		b && b.length && this.addMarkers(b, !1);
}
function Cluster(a) {
	(this.markerClusterer_ = a),
		(this.map_ = a.getMap()),
		(this.gridSize_ = a.getGridSize()),
		(this.minClusterSize_ = a.getMinClusterSize()),
		(this.averageCenter_ = a.isAverageCenter()),
		(this.center_ = null),
		(this.markers_ = []),
		(this.bounds_ = null),
		(this.clusterIcon_ = new ClusterIcon(
			this,
			a.getStyles(),
			a.getGridSize(),
		));
}
function ClusterIcon(a, b, c) {
	a.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView),
		(this.styles_ = b),
		(this.padding_ = c || 0),
		(this.cluster_ = a),
		(this.center_ = null),
		(this.map_ = a.getMap()),
		(this.div_ = null),
		(this.sums_ = null),
		(this.visible_ = !1),
		this.setMap(this.map_);
}
(MarkerClusterer.prototype.onClickZoom = function () {
	return !0;
}),
	(MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = "images/m"),
	(MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = "png"),
	(MarkerClusterer.prototype.extend = function (a, b) {
		return function (a) {
			for (var b in a.prototype) this.prototype[b] = a.prototype[b];
			return this;
		}.apply(a, [b]);
	}),
	(MarkerClusterer.prototype.onAdd = function () {
		this.setReady_(!0);
	}),
	(MarkerClusterer.prototype.draw = function () {}),
	(MarkerClusterer.prototype.setupStyles_ = function () {
		if (!this.styles_.length)
			for (var b, a = 0; (b = this.sizes[a]); a++)
				this.styles_.push({
					url: this.imagePath_ + (a + 1) + "." + this.imageExtension_,
					height: b,
					width: b,
				});
	}),
	(MarkerClusterer.prototype.fitMapToMarkers = function () {
		for (
			var d,
				a = this.getMarkers(),
				b = new google.maps.LatLngBounds(),
				c = 0;
			(d = a[c]);
			c++
		)
			b.extend(d.getPosition());
		this.map_.fitBounds(b);
	}),
	(MarkerClusterer.prototype.setStyles = function (a) {
		this.styles_ = a;
	}),
	(MarkerClusterer.prototype.getStyles = function () {
		return this.styles_;
	}),
	(MarkerClusterer.prototype.isZoomOnClick = function () {
		return this.zoomOnClick_;
	}),
	(MarkerClusterer.prototype.isAverageCenter = function () {
		return this.averageCenter_;
	}),
	(MarkerClusterer.prototype.getMarkers = function () {
		return this.markers_;
	}),
	(MarkerClusterer.prototype.getTotalMarkers = function () {
		return this.markers_.length;
	}),
	(MarkerClusterer.prototype.setMaxZoom = function (a) {
		this.maxZoom_ = a;
	}),
	(MarkerClusterer.prototype.getMaxZoom = function () {
		return (
			this.maxZoom_ ||
			this.map_.mapTypes[this.map_.getMapTypeId()].maxZoom
		);
	}),
	(MarkerClusterer.prototype.calculator_ = function (a, b) {
		for (var c = 0, d = a.length, e = d; 0 !== e; )
			(e = parseInt(e / 10, 10)), c++;
		return (c = Math.min(c, b)), { text: d, index: c };
	}),
	(MarkerClusterer.prototype.setCalculator = function (a) {
		this.calculator_ = a;
	}),
	(MarkerClusterer.prototype.getCalculator = function () {
		return this.calculator_;
	}),
	(MarkerClusterer.prototype.addMarkers = function (a, b) {
		for (var d, c = 0; (d = a[c]); c++) this.pushMarkerTo_(d);
		b || this.redraw();
	}),
	(MarkerClusterer.prototype.pushMarkerTo_ = function (a) {
		if (((a.isAdded = !1), a.draggable)) {
			var b = this;
			google.maps.event.addListener(a, "dragend", function () {
				(a.isAdded = !1), b.repaint();
			});
		}
		this.markers_.push(a);
	}),
	(MarkerClusterer.prototype.addMarker = function (a, b) {
		this.pushMarkerTo_(a), b || this.redraw();
	}),
	(MarkerClusterer.prototype.removeMarker_ = function (a) {
		var b = -1;
		if (this.markers_.indexOf) b = this.markers_.indexOf(a);
		else
			for (var d, c = 0; (d = this.markers_[c]); c++)
				if (d == a) {
					b = c;
					break;
				}
		return b != -1 && (a.setMap(null), this.markers_.splice(b, 1), !0);
	}),
	(MarkerClusterer.prototype.removeMarker = function (a, b) {
		var c = this.removeMarker_(a);
		return !(b || !c) && (this.resetViewport(), this.redraw(), !0);
	}),
	(MarkerClusterer.prototype.removeMarkers = function (a, b) {
		for (var e, c = !1, d = 0; (e = a[d]); d++) {
			var f = this.removeMarker_(e);
			c = c || f;
		}
		if (!b && c) return this.resetViewport(), this.redraw(), !0;
	}),
	(MarkerClusterer.prototype.setReady_ = function (a) {
		this.ready_ || ((this.ready_ = a), this.createClusters_());
	}),
	(MarkerClusterer.prototype.getTotalClusters = function () {
		return this.clusters_.length;
	}),
	(MarkerClusterer.prototype.getMap = function () {
		return this.map_;
	}),
	(MarkerClusterer.prototype.setMap = function (a) {
		this.map_ = a;
	}),
	(MarkerClusterer.prototype.getGridSize = function () {
		return this.gridSize_;
	}),
	(MarkerClusterer.prototype.setGridSize = function (a) {
		this.gridSize_ = a;
	}),
	(MarkerClusterer.prototype.getMinClusterSize = function () {
		return this.minClusterSize_;
	}),
	(MarkerClusterer.prototype.setMinClusterSize = function (a) {
		this.minClusterSize_ = a;
	}),
	(MarkerClusterer.prototype.getExtendedBounds = function (a) {
		var b = this.getProjection(),
			c = new google.maps.LatLng(
				a.getNorthEast().lat(),
				a.getNorthEast().lng(),
			),
			d = new google.maps.LatLng(
				a.getSouthWest().lat(),
				a.getSouthWest().lng(),
			),
			e = b.fromLatLngToDivPixel(c);
		(e.x += this.gridSize_), (e.y -= this.gridSize_);
		var f = b.fromLatLngToDivPixel(d);
		(f.x -= this.gridSize_), (f.y += this.gridSize_);
		var g = b.fromDivPixelToLatLng(e),
			h = b.fromDivPixelToLatLng(f);
		return a.extend(g), a.extend(h), a;
	}),
	(MarkerClusterer.prototype.isMarkerInBounds_ = function (a, b) {
		return b.contains(a.getPosition());
	}),
	(MarkerClusterer.prototype.clearMarkers = function () {
		this.resetViewport(!0), (this.markers_ = []);
	}),
	(MarkerClusterer.prototype.resetViewport = function (a) {
		for (var c, b = 0; (c = this.clusters_[b]); b++) c.remove();
		for (var d, b = 0; (d = this.markers_[b]); b++)
			(d.isAdded = !1), a && d.setMap(null);
		this.clusters_ = [];
	}),
	(MarkerClusterer.prototype.repaint = function () {
		var a = this.clusters_.slice();
		(this.clusters_.length = 0),
			this.resetViewport(),
			this.redraw(),
			window.setTimeout(function () {
				for (var c, b = 0; (c = a[b]); b++) c.remove();
			}, 0);
	}),
	(MarkerClusterer.prototype.redraw = function () {
		this.createClusters_();
	}),
	(MarkerClusterer.prototype.distanceBetweenPoints_ = function (a, b) {
		if (!a || !b) return 0;
		var c = 6371,
			d = ((b.lat() - a.lat()) * Math.PI) / 180,
			e = ((b.lng() - a.lng()) * Math.PI) / 180,
			f =
				Math.sin(d / 2) * Math.sin(d / 2) +
				Math.cos((a.lat() * Math.PI) / 180) *
					Math.cos((b.lat() * Math.PI) / 180) *
					Math.sin(e / 2) *
					Math.sin(e / 2),
			g = 2 * Math.atan2(Math.sqrt(f), Math.sqrt(1 - f)),
			h = c * g;
		return h;
	}),
	(MarkerClusterer.prototype.addToClosestCluster_ = function (a) {
		for (
			var f, b = 4e4, c = null, e = (a.getPosition(), 0);
			(f = this.clusters_[e]);
			e++
		) {
			var g = f.getCenter();
			if (g) {
				var h = this.distanceBetweenPoints_(g, a.getPosition());
				h < b && ((b = h), (c = f));
			}
		}
		if (c && c.isMarkerInClusterBounds(a)) c.addMarker(a);
		else {
			var f = new Cluster(this);
			f.addMarker(a), this.clusters_.push(f);
		}
	}),
	(MarkerClusterer.prototype.createClusters_ = function () {
		if (this.ready_)
			for (
				var d,
					a = new google.maps.LatLngBounds(
						this.map_.getBounds().getSouthWest(),
						this.map_.getBounds().getNorthEast(),
					),
					b = this.getExtendedBounds(a),
					c = 0;
				(d = this.markers_[c]);
				c++
			)
				!d.isAdded &&
					this.isMarkerInBounds_(d, b) &&
					this.addToClosestCluster_(d);
	}),
	(Cluster.prototype.isMarkerAlreadyAdded = function (a) {
		if (this.markers_.indexOf) return this.markers_.indexOf(a) != -1;
		for (var c, b = 0; (c = this.markers_[b]); b++) if (c == a) return !0;
		return !1;
	}),
	(Cluster.prototype.addMarker = function (a) {
		if (this.isMarkerAlreadyAdded(a)) return !1;
		if (this.center_) {
			if (this.averageCenter_) {
				var b = this.markers_.length + 1,
					c =
						(this.center_.lat() * (b - 1) + a.getPosition().lat()) /
						b,
					d =
						(this.center_.lng() * (b - 1) + a.getPosition().lng()) /
						b;
				(this.center_ = new google.maps.LatLng(c, d)),
					this.calculateBounds_();
			}
		} else (this.center_ = a.getPosition()), this.calculateBounds_();
		(a.isAdded = !0), this.markers_.push(a);
		var e = this.markers_.length;
		if (
			(e < this.minClusterSize_ &&
				a.getMap() != this.map_ &&
				a.setMap(this.map_),
			e == this.minClusterSize_)
		)
			for (var f = 0; f < e; f++) this.markers_[f].setMap(null);
		return (
			e >= this.minClusterSize_ && a.setMap(null), this.updateIcon(), !0
		);
	}),
	(Cluster.prototype.getMarkerClusterer = function () {
		return this.markerClusterer_;
	}),
	(Cluster.prototype.getBounds = function () {
		for (
			var d,
				a = new google.maps.LatLngBounds(this.center_, this.center_),
				b = this.getMarkers(),
				c = 0;
			(d = b[c]);
			c++
		)
			a.extend(d.getPosition());
		return a;
	}),
	(Cluster.prototype.remove = function () {
		this.clusterIcon_.remove(),
			(this.markers_.length = 0),
			delete this.markers_;
	}),
	(Cluster.prototype.getSize = function () {
		return this.markers_.length;
	}),
	(Cluster.prototype.getMarkers = function () {
		return this.markers_;
	}),
	(Cluster.prototype.getCenter = function () {
		return this.center_;
	}),
	(Cluster.prototype.calculateBounds_ = function () {
		var a = new google.maps.LatLngBounds(this.center_, this.center_);
		this.bounds_ = this.markerClusterer_.getExtendedBounds(a);
	}),
	(Cluster.prototype.isMarkerInClusterBounds = function (a) {
		return this.bounds_.contains(a.getPosition());
	}),
	(Cluster.prototype.getMap = function () {
		return this.map_;
	}),
	(Cluster.prototype.updateIcon = function () {
		var a = this.map_.getZoom(),
			b = this.markerClusterer_.getMaxZoom();
		if (a > b)
			for (var d, c = 0; (d = this.markers_[c]); c++) d.setMap(this.map_);
		else {
			if (this.markers_.length < this.minClusterSize_)
				return void this.clusterIcon_.hide();
			var e = this.markerClusterer_.getStyles().length,
				f = this.markerClusterer_.getCalculator()(this.markers_, e);
			this.clusterIcon_.setCenter(this.center_),
				this.clusterIcon_.setSums(f),
				this.clusterIcon_.show();
		}
	}),
	(ClusterIcon.prototype.triggerClusterClick = function () {
		var a = this.cluster_.getMarkerClusterer();
		google.maps.event.trigger(a, "clusterclick", this.cluster_);
		var b = this.map_.getZoom(),
			c = a.getMaxZoom();
		return b >= c && this.cluster_.markers_.length > 1
			? a.onClickZoom(this)
			: void (
					a.isZoomOnClick() &&
					this.map_.fitBounds(this.cluster_.getBounds())
			  );
	}),
	(ClusterIcon.prototype.onAdd = function () {
		if (((this.div_ = document.createElement("DIV")), this.visible_)) {
			var a = this.getPosFromLatLng_(this.center_);
			(this.div_.style.cssText = this.createCss(a)),
				(this.div_.innerHTML = this.sums_.text);
		}
		var b = this.getPanes();
		b.overlayMouseTarget.appendChild(this.div_);
		var c = this;
		this.div_.addEventListener("click", function () {
			c.triggerClusterClick();
		});
	}),
	(ClusterIcon.prototype.getPosFromLatLng_ = function (a) {
		var b = this.getProjection().fromLatLngToDivPixel(a);
		return (
			(b.x -= parseInt(this.width_ / 2, 10)),
			(b.y -= parseInt(this.height_ / 2, 10)),
			b
		);
	}),
	(ClusterIcon.prototype.draw = function () {
		if (this.visible_) {
			var a = this.getPosFromLatLng_(this.center_);
			(this.div_.style.top = a.y + "px"),
				(this.div_.style.left = a.x + "px");
		}
	}),
	(ClusterIcon.prototype.hide = function () {
		this.div_ && (this.div_.style.display = "none"), (this.visible_ = !1);
	}),
	(ClusterIcon.prototype.show = function () {
		if (this.div_) {
			var a = this.getPosFromLatLng_(this.center_);
			(this.div_.style.cssText = this.createCss(a)),
				(this.div_.style.display = "");
		}
		this.visible_ = !0;
	}),
	(ClusterIcon.prototype.remove = function () {
		this.setMap(null);
	}),
	(ClusterIcon.prototype.onRemove = function () {
		this.div_ &&
			this.div_.parentNode &&
			(this.hide(),
			this.div_.parentNode.removeChild(this.div_),
			(this.div_ = null));
	}),
	(ClusterIcon.prototype.setSums = function (a) {
		(this.sums_ = a),
			(this.text_ = a.text),
			(this.index_ = a.index),
			this.div_ && (this.div_.innerHTML = a.text),
			this.useStyle();
	}),
	(ClusterIcon.prototype.useStyle = function () {
		var a = Math.max(0, this.sums_.index - 1);
		a = Math.min(this.styles_.length - 1, a);
		var b = this.styles_[a];
		(this.url_ = b.url),
			(this.height_ = b.height),
			(this.width_ = b.width),
			(this.textColor_ = b.textColor),
			(this.anchor_ = b.anchor),
			(this.textSize_ = b.textSize),
			(this.backgroundPosition_ = b.backgroundPosition);
	}),
	(ClusterIcon.prototype.setCenter = function (a) {
		this.center_ = a;
	}),
	(ClusterIcon.prototype.createCss = function (a) {
		var b = [];
		b.push("background-image:url(" + this.url_ + ");");
		var c = this.backgroundPosition_ ? this.backgroundPosition_ : "0 0";
		b.push("background-position:" + c + ";"),
			"object" == typeof this.anchor_
				? ("number" == typeof this.anchor_[0] &&
				  this.anchor_[0] > 0 &&
				  this.anchor_[0] < this.height_
						? b.push(
								"height:" +
									(this.height_ - this.anchor_[0]) +
									"px; padding-top:" +
									this.anchor_[0] +
									"px;",
						  )
						: b.push(
								"height:" +
									this.height_ +
									"px; line-height:" +
									this.height_ +
									"px;",
						  ),
				  "number" == typeof this.anchor_[1] &&
				  this.anchor_[1] > 0 &&
				  this.anchor_[1] < this.width_
						? b.push(
								"width:" +
									(this.width_ - this.anchor_[1]) +
									"px; padding-left:" +
									this.anchor_[1] +
									"px;",
						  )
						: b.push(
								"width:" +
									this.width_ +
									"px; text-align:center;",
						  ))
				: b.push(
						"height:" +
							this.height_ +
							"px; line-height:" +
							this.height_ +
							"px; width:" +
							this.width_ +
							"px; text-align:center;",
				  );
		var d = this.textColor_ ? this.textColor_ : "black",
			e = this.textSize_ ? this.textSize_ : 11;
		return (
			b.push(
				"cursor:pointer; top:" +
					a.y +
					"px; left:" +
					a.x +
					"px; color:" +
					d +
					"; position:absolute; font-size:" +
					e +
					"px; font-family:Arial,sans-serif; font-weight:bold",
			),
			b.join("")
		);
	}),
	(window.MarkerClusterer = MarkerClusterer),
	(MarkerClusterer.prototype.addMarker = MarkerClusterer.prototype.addMarker),
	(MarkerClusterer.prototype.addMarkers =
		MarkerClusterer.prototype.addMarkers),
	(MarkerClusterer.prototype.clearMarkers =
		MarkerClusterer.prototype.clearMarkers),
	(MarkerClusterer.prototype.fitMapToMarkers =
		MarkerClusterer.prototype.fitMapToMarkers),
	(MarkerClusterer.prototype.getCalculator =
		MarkerClusterer.prototype.getCalculator),
	(MarkerClusterer.prototype.getGridSize =
		MarkerClusterer.prototype.getGridSize),
	(MarkerClusterer.prototype.getExtendedBounds =
		MarkerClusterer.prototype.getExtendedBounds),
	(MarkerClusterer.prototype.getMap = MarkerClusterer.prototype.getMap),
	(MarkerClusterer.prototype.getMarkers =
		MarkerClusterer.prototype.getMarkers),
	(MarkerClusterer.prototype.getMaxZoom =
		MarkerClusterer.prototype.getMaxZoom),
	(MarkerClusterer.prototype.getStyles = MarkerClusterer.prototype.getStyles),
	(MarkerClusterer.prototype.getTotalClusters =
		MarkerClusterer.prototype.getTotalClusters),
	(MarkerClusterer.prototype.getTotalMarkers =
		MarkerClusterer.prototype.getTotalMarkers),
	(MarkerClusterer.prototype.redraw = MarkerClusterer.prototype.redraw),
	(MarkerClusterer.prototype.removeMarker =
		MarkerClusterer.prototype.removeMarker),
	(MarkerClusterer.prototype.removeMarkers =
		MarkerClusterer.prototype.removeMarkers),
	(MarkerClusterer.prototype.resetViewport =
		MarkerClusterer.prototype.resetViewport),
	(MarkerClusterer.prototype.repaint = MarkerClusterer.prototype.repaint),
	(MarkerClusterer.prototype.setCalculator =
		MarkerClusterer.prototype.setCalculator),
	(MarkerClusterer.prototype.setGridSize =
		MarkerClusterer.prototype.setGridSize),
	(MarkerClusterer.prototype.setMaxZoom =
		MarkerClusterer.prototype.setMaxZoom),
	(MarkerClusterer.prototype.onAdd = MarkerClusterer.prototype.onAdd),
	(MarkerClusterer.prototype.draw = MarkerClusterer.prototype.draw),
	(Cluster.prototype.getCenter = Cluster.prototype.getCenter),
	(Cluster.prototype.getSize = Cluster.prototype.getSize),
	(Cluster.prototype.getMarkers = Cluster.prototype.getMarkers),
	(ClusterIcon.prototype.onAdd = ClusterIcon.prototype.onAdd),
	(ClusterIcon.prototype.draw = ClusterIcon.prototype.draw),
	(ClusterIcon.prototype.onRemove = ClusterIcon.prototype.onRemove);
