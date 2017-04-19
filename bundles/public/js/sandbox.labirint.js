(function($){
    (function(init){
        init();
    }(function(){

        /*
         ----------------------------------------
         PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S)
         ----------------------------------------
         */

        var pluginNS="labirintGame",
            pluginPfx="labirintGame",
            defaultSelector=".game-labirint",
            labirintData = {},
            labirintStorage = null,
            timerSeconds = 10,
            labirintInterval = null,
            timerInterval = null,
            marker = null,
            socket = io.connect('http://localhost:8080'),

        /*
         ----------------------------------------
         DEFAULT OPTIONS
         ----------------------------------------
         */

            defaults={

                userInfoUrl: '/ajax/sandbox/labirint/data',
                labirintDataUrl: '/data/labirint/labirint.json',
                resultUpdateUrl: '/ajax/sandbox/labirint/data',

                messageInit: '<h2 class="init-message">Игра загружается, подождите...</h2>',
                messageBefore: '<h2 class="before-message">Время начала игры<br>#time#</h2><br><button class="btn" id="btn-reload">Обновить страницу</button>',
                messageAfter: '<h2 class="end-message">Игра завершена.<br>Результаты будут объявлены позже.</h2>'
            },

        /*
         ----------------------------------------
         VARS, CONSTANTS
         ----------------------------------------
         */

            totalInstances=0, /* plugin instances amount */
        /* general plugin classes */


        /*
         ----------------------------------------
         METHODS
         ----------------------------------------
         */

            methods={

                /*
                 plugin initialization method
                 creates the scrollbar(s), plugin data object and options
                 ----------------------------------------
                 */

                init:function(options){
                    var that = this;

                    var options=$.extend(true,{},defaults,options),
                        selector=_selector.call(this); /* validate selector */

                    /* plugin constructor */
                    return $(selector).each(function(){

                        var $this=$(this);

                        if(!$this.data(pluginPfx)){ /* prevent multiple instantiations */

                            /* store options and create objects in jquery data */
                            $this.data(pluginPfx,{
                                idx:++totalInstances, /* instance index */
                                opt:options, /* options */
                                /*
                                 object to check how scrolling events where last triggered
                                 "internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method)
                                 usage: object.data("mCS").trigger
                                 */
                                trigger:null
                            });

                            var d=$this.data(pluginPfx),o=d.opt;

                            ns=$.initNamespaceStorage(pluginNS);
                            labirintStorage = ns.localStorage // Namespace in localStorage

                            _initMessage.call(this);

                            _loadData.call(this);
                            _setEvents.call(this);

                            $.get(o.userInfoUrl+'?_='+ new Date().getTime(), {},
                                function(data){
                                    if (data.error) {
                                        $this.html('<h2 class="init-message">'+data.error+'</h2>');
                                        return;
                                    }

                                    data.game.stop = parseInt(data.game.start) + (data.game.duration*60);

                                    labirintStorage.set('start', data.game.start);
                                    labirintStorage.set('duration', data.game.duration);
                                    labirintStorage.set('stop', data.game.stop);
                                    labirintStorage.set('user', data.game.user);
                                    labirintStorage.set('ship', data.game.ship);
                                    labirintStorage.set('state', data.game.state);

                                    for (i = 1; i < 5; i++) {
                                        if (data.game.state.markers['marker'+i] == data.game.user) {
                                            marker = 'marker'+i;
                                            break;
                                        }
                                    }

                                    if (!marker) {
                                        $this.html('<h2 class="init-message">Ошибка инициализации</h2>');
                                        return;
                                    }

                                    var minutes = data.game.stop-data.game.current;
                                    var timerMinutes = _integerDivision(minutes, 60);
                                    labirintStorage.set('minutes', timerMinutes );
                                    labirintStorage.set('seconds', minutes - timerMinutes*60);
                                    if (labirintStorage.get('start') > data.game.current) {
                                        _beforeMessage.call(that);
                                    } else if (labirintStorage.get('stop') < data.game.current) {
                                        _afterMessage.call(that);
                                    } else {
                                        methods.start.call(that);
                                        methods.setup.call(that);
                                    }
                                }, "json");

                        }
                    });
                },
                /* ---------------------------------------- */

                start: function() {
                    var that = this;
                    var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                    _pluginMarkup.call(that);

                    $('#timer').html(labirintStorage.get('minutes')+':'+labirintStorage.get('seconds'));
                    taskInterval = setInterval(function(){
                        var timerMinutes = labirintStorage.get('minutes');
                        var timerSeconds = labirintStorage.get('seconds');
                        if (timerSeconds == 0) {
                            timerMinutes--;
                            timerSeconds = 59;
                        } else {
                            timerSeconds--;
                        }
                        $('#timer').html(timerMinutes+':'+timerSeconds);
                        labirintStorage.set('minutes', timerMinutes);
                        labirintStorage.set('seconds', timerSeconds);
                        if (timerMinutes <= 0 && timerSeconds <= 0) {
                            $('.labirint-time').trigger('click');
                        }
                    }, 1000);

                },
                /* ---------------------------------------- */

                setup: function() {
                    var that = this;
                    var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                    var state = labirintStorage.get('state');


                    for (i = 1; i < 5; i++) {
                        $('#marker'+i)
                            .removeClass()
                            .addClass('cell'+state.positions['marker'+i]);
                    }

                    if (marker == state.who_run) {
                        $('#dice').show();
                        $('#result').html('Жми на кубик');
                    } else {
                        $('#result').html('Ход делает ' + state.colors[state.who_run] + ' игрок!');
                        $('#dice').hide();
                    }
                },

                stop: function() {
                    var that = this;
                    var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                    clearInterval(labirintInterval);
                    $('#timer').delay(1000).hide(0, function(){
                        _afterMessage.call(that);
                    });
                }
                /* ---------------------------------------- */

            },


        /*
         ----------------------------------------
         FUNCTIONS
         ----------------------------------------
         */

        /* validates selector (if selector is invalid or undefined uses the default one) */
            _selector=function(){
                return (typeof $(this)!=="object" || $(this).length<1) ? defaultSelector : this;
            };
        /* -------------------- */

        /* init message */
            _initMessage=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                $this.html(o.messageInit);
            };
        /* -------------------- */

        /* before message */
            _beforeMessage=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;
                var dt = new Date(labirintStorage.get('start')*1000);
                var msg = o.messageBefore;
                msg = msg.replace('#time#', dt.getFullYear() + '.' + (dt.getMonth()<10?'0':'') + dt.getMonth() + '.' + (dt.getDate()<10?'0':'') + dt.getDate() + ' ' + (dt.getHours()<10?'0':'') + dt.getHours() + ':' + (dt.getMinutes()<10?'0':'') + dt.getMinutes());
                $this.html(msg);
            };
        /* -------------------- */

        /* after message */
            _afterMessage=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                $this.html(o.messageAfter);
            };
        /* -------------------- */

        /* generates plugin markup */
            _pluginMarkup=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                $this.html('<div class="relative"><div id="timer"></div><div id="ship-map"></div><div id="step7" class="step"></div><div id="step11" class="step"></div><div id="step15" class="step"></div><div id="step24" class="step"></div><div id="step27" class="step"></div><div id="step29" class="step"></div><div id="step30" class="step"></div><div id="step33" class="step"></div><div id="step36" class="step"></div><div id="step41" class="step"></div><div id="step46" class="step"></div><div id="step58" class="step"></div><div id="step61" class="step"></div><div id="step65" class="step"></div><div id="step69" class="step"></div><div id="step72" class="step"></div><div id="step75" class="step"></div><div id="step80" class="step"></div><div id="step82" class="step"></div><div id="step84" class="step"></div><div id="step87" class="step"></div><div id="step94" class="step"></div><div id="step98" class="step"></div><div id="step5" class="step death"></div><div id="step8" class="step money"></div><div id="step9" class="step time"></div><div id="step14" class="step chest"></div><div id="step19" class="step rom"></div><div id="step23" class="step coffee"></div><div id="step38" class="step chest"></div><div id="step40" class="step time"></div><div id="step42" class="step death"></div><div id="step44" class="step time"></div><div id="step45" class="step money"></div><div id="step49" class="step time"></div><div id="step51" class="step coffee"></div><div id="step54" class="step death"></div><div id="step59" class="step time"></div><div id="step63" class="step money"></div><div id="step70" class="step money"></div><div id="step74" class="step time"></div><div id="step83" class="step chest"></div><div id="step85" class="step money"></div><div id="step86" class="step time"></div><div id="step90" class="step time"></div><div id="step95" class="step chest"></div><div id="step96" class="step time"></div><div id="step97" class="step money"></div><div id="marker1" class="cell0"></div><div id="marker2" class="cell0"></div><div id="marker3" class="cell0"></div><div id="marker4" class="cell0"></div><div class="info"><!-- <div class="message">Ход делает красный игрок!</div>--><div class="message" id="result"></div><div class="wrap"><div id="dice" class="dice"></div></div></div><div class="labirint-time"></div></div>');
            };
        /* -------------------- */

        /* set events for buttons */
            _setEvents=function(){
                var that = this;
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                $(document).on('click', '#btn-reload', function(){
                    window.location.reload();
                });

                $(document).on('click', '#dice', function(){
                    $(".wrap").append("<div id='dice_mask'></div>");//add mask
                    dice.attr("class","dice");//After clearing the last points animation
                    dice.css('cursor','default');
                    var num = Math.floor(Math.random()*6+1);//random num 1-6

                    dice.animate({left: '+2px'}, 100,function(){
                        dice.addClass("dice_t");
                    }).delay(200).animate({top:'-2px'},100,function(){
                        dice.removeClass("dice_t").addClass("dice_s");
                    }).delay(200).animate({opacity: 'show'},600,function(){
                        dice.removeClass("dice_s").addClass("dice_e");
                    }).delay(100).animate({left:'-2px',top:'2px'},100,function(){
                        dice.removeClass("dice_e").addClass("dice_"+num);
                        $("#result").html("Вы выкинули <span>"+num+"</span>");
                        dice.css('cursor','pointer');
                        $("#dice_mask").remove();//remove mask
                    });
                });

            };
        /* -------------------- */

        /* set events for buttons */
            _setTime=function(){
                var that = this;
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                $(document).on('click', '#task-btn-answer', function(){
                    window.location.reload();
                });

            };
        /* -------------------- */

            _integerDivision=function (x, y){
                return (x-x%y)/y;
            };

        /* load map data from backend */
        _loadData=function() {
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt;
            $.get(o.labirintDataUrl, {},
                function(data){
                    labirintData = data;
                }, "json");
        }
        /* -------------------- */

        /*
         ----------------------------------------
         PLUGIN SETUP
         ----------------------------------------
         */

        /* plugin constructor functions */
        $.fn[pluginNS]=function(method){ /* usage: $(selector).diceGame(); */
            if(methods[method]){
                return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
            }else if(typeof method==="object" || !method){
                return methods.init.apply(this,arguments);
            }else{
                $.error("Method "+method+" does not exist");
            }
        };
        $[pluginNS]=function(method){ /* usage: $.diceGame(); */
            if(methods[method]){
                return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
            }else if(typeof method==="object" || !method){
                return methods.init.apply(this,arguments);
            }else{
                $.error("Method "+method+" does not exist");
            }
        };

        /*
         allow setting plugin default options.
         usage: $.mCustomScrollbar.defaults.scrollInertia=500;
         to apply any changed default options on default selectors (below), use inside document ready fn
         e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
         */
        $[pluginNS].defaults=defaults;

        /*
         add window object (window.mCustomScrollbar)
         usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
         */
        window[pluginNS]=true;

        $(window).load(function(){

            $(defaultSelector)[pluginNS](); /* add scrollbars automatically on default selector */

        });

    }))})(jQuery);

