(function($){
    (function(init){
        init();
    }(function(){

        /*
         ----------------------------------------
         PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S)
         ----------------------------------------
         */

        var pluginNS="duelGame",
            pluginPfx="duelGame",
            defaultSelector=".game-duel",
            duelData = {},
            duelStorage = null,
            stepTime = 25,
            stepInterval = null,
            duelInterval = null,
            socket = io.connect('http://localhost:8080'),
            marker = null,
            question = {}

        /*
         ----------------------------------------
         DEFAULT OPTIONS
         ----------------------------------------
         */

            defaults={

                userInfoUrl: '/ajax/sandbox/duel/data',
                questionUrl: '/ajax/sandbox/duel/question',
                resultUpdateUrl: '/ajax/sandbox/duel/data',

                messageInit: '<h2 class="init-message">Игра загружается, подождите...</h2>',
                messageBefore: '<h2 class="before-message">Время начала игры<br><span id="before-timer">#time#</span></h2><br><button class="btn" id="btn-reload">Обновить страницу</button>',
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
                            duelStorage = ns.localStorage // Namespace in localStorage

                            _initMessage.call(this);

                            _setEvents.call(this);

                            socket.on('stop game', function(){
                                _afterMessage.call(this);
                            });

                            socket.on('start game', function(data){
                                methods.start.call(that);
                                methods.setup.call(that);
                            });

                            socket.on('update state', function (data) {
                                clearInterval(stepInterval);
                                duelStorage.set('state', data.state);
                                $.post(o.resultUpdateUrl , {state: data.state}, function(data) {
                                    // console.log(data.message)
                                }, 'json');
                                setTimeout(function() {
                                    methods.setup.call(that);
                                }, 2000);

                            });

                            $.get(o.userInfoUrl+'?_='+ new Date().getTime(), {},
                                function(data){
                                    if (data.error) {
                                        $this.html('<h2 class="init-message">'+data.error+'</h2>');
                                        return;
                                    }

                                    data.game.stop = parseInt(data.game.start) + (data.game.duration*60);

                                    duelStorage.set('start', data.game.start);
                                    duelStorage.set('duration', data.game.duration);
                                    duelStorage.set('stop', data.game.stop);
                                    duelStorage.set('user', data.game.user);
                                    duelStorage.set('duel', data.game.id);
                                    duelStorage.set('state', data.game.state);

                                    socket.emit('init game', {
                                        state: duelStorage.get('state'),
                                        starttime: duelStorage.get('start'),
                                        stoptime: duelStorage.get('stop')
                                    });

                                    marker = 'user'+data.game.user;

                                    if (!marker) {
                                        $this.html('<h2 class="init-message">Ошибка инициализации</h2>');
                                        return;
                                    }

                                    var minutes = data.game.stop-data.game.current;
                                    var timerMinutes = _integerDivision(minutes, 60);
                                    duelStorage.set('minutes', timerMinutes );
                                    duelStorage.set('seconds', minutes - timerMinutes*60);
                                    if (duelStorage.get('start') > data.game.current) {
                                        _beforeMessage.call(that);
                                    } else if (duelStorage.get('stop') < data.game.current || data.game.state.step > 25) {
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

                    var state = duelStorage.get('state');
                    $('#qnum').text(state.step);
                    // var $timer = $('#timer');
                    // $timer.html(duelStorage.get('minutes')+':'+duelStorage.get('seconds'));
                    // duelInterval = setInterval(function(){
                    //     var timerMinutes = duelStorage.get('minutes');
                    //     var timerSeconds = duelStorage.get('seconds');
                    //     if (timerSeconds == 0) {
                    //         timerMinutes--;
                    //         timerSeconds = 59;
                    //     } else {
                    //         timerSeconds--;
                    //     }
                    //     $timer.html(timerMinutes+':'+timerSeconds);
                    //     duelStorage.set('minutes', timerMinutes);
                    //     duelStorage.set('seconds', timerSeconds);
                    //     if (timerMinutes <= 0 && timerSeconds <= 0) {
                    //         $('#duel-time').trigger('click');
                    //     }
                    // }, 1000);

                },
                /* ---------------------------------------- */

                setup: function() {
                    var that = this;
                    var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                    var state = duelStorage.get('state');

                    //console.log('setup', state);
                    $('#qnum').text(state.step);
                    if (marker == state.who_run) {
                        if (duelStorage.isEmpty('step_seconds')) {
                            duelStorage.set('step_seconds', stepTime);
                        }
                        if (duelStorage.isEmpty('question')) {
                            $.post(o.questionUrl, {step: state.step}, function(data) {
                                if (data.error) {
                                    alert(data.error);
                                    return;
                                }
                                duelStorage.set('question', data.question);
                                var question = duelStorage.get('question');
                                $('#question').html(question.question);
                                $('#answer_1').html(question.answer1);
                                $('#answer_2').html(question.answer2);
                                $('#answer_3').html(question.answer3);
                                $('#btn-answer').show();
                                $('#question').show();
                                $('#answers').show();

                                $('#btn-answer').show();
                                $('#timer').html(duelStorage.get('step_seconds'));
                                stepInterval = setInterval(function(){

                                    var stepSeconds = duelStorage.get('step_seconds');
                                    stepSeconds--;

                                    $('#timer').html(stepSeconds);
                                    duelStorage.set('step_seconds', stepSeconds);
                                    if (stepSeconds <= 0) {
                                        duelStorage.remove('step_seconds');
                                        clearInterval(stepInterval);
                                        socket.emit('move', {state: duelStorage.get('state'), marker: marker, num: 0})
                                    }
                                }, 1000);
                            })
                        } else {
                            var question = duelStorage.get('question');
                            $('#question').html(question.question);
                            $('#answer_1').html(question.answer1);
                            $('#answer_2').html(question.answer2);
                            $('#answer_3').html(question.answer3);
                            $('#btn-answer').show();
                            $('#question').show();
                            $('#answers').show();

                            $('#btn-answer').show();
                            $('#timer').html(duelStorage.get('step_seconds'));
                            stepInterval = setInterval(function(){

                                var stepSeconds = duelStorage.get('step_seconds');
                                stepSeconds--;

                                $('#timer').html(stepSeconds);
                                duelStorage.set('step_seconds', stepSeconds);
                                if (stepSeconds <= 0) {
                                    duelStorage.remove('step_seconds');
                                    clearInterval(stepInterval);
                                    socket.emit('move', {state: duelStorage.get('state'), marker: marker, num: 0})
                                }
                            }, 1000);
                        }
                    } else {
                        $('#btn-answer').hide();
                        $('#question').hide();
                        $('#answers').hide();
                        $('#timer').html('Ход делает соперник!');
                    }
                },

                stop: function() {
                    var that = this;
                    var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                    clearInterval(duelInterval);
                    clearInterval(stepInterval);
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
                var dt = new Date(duelStorage.get('start')*1000);
                var msg = o.messageBefore;
                msg = msg.replace('#time#', dt.getFullYear() + '.' + (dt.getMonth()<10?'0':'') + dt.getMonth() + '.' + (dt.getDate()<10?'0':'') + dt.getDate() + ' ' + (dt.getHours()<10?'0':'') + dt.getHours() + ':' + (dt.getMinutes()<10?'0':'') + dt.getMinutes());
                $this.html(msg);
            };
        /* -------------------- */

        /* after message */
            _afterMessage=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                //socket.emit('stop game', {ship: duelStorage.get('ship')});
                $this.html(o.messageAfter);
            };
        /* -------------------- */

        /* generates plugin markup */
            _pluginMarkup=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                $this.html('<div class="relative"><div class="question"><div id="timer" class="timer"></div><div class="title"><strong>Вопрос <span id="qnum"></span> из 25</strong></div> <div class="text" id="questions"></div><ul class="answers" id="answers"><li><input type="radio" id="answer_1" name="answer" value="1" /><label for="answer_1"></label></li><li><input type="radio" id="answer_2" name="answer" value="2" /><label for="answer_2"></label> </li><li><input type="radio" id="answer_3" name="answer" value="3" /><label for="answer_3"></label></li> </ul></div></div><div class="gamer gamer1" id="user"><img src=""> <div class="name"></div> <div class="ship"></div> <div class="action"><div id="user1-count"></div><button class="btn btn-duel-answer">Ответить</button></div></div><div class="gamer gamer2" id="rival"><img src=""> <div class="name"></div><div class="ship"></div><div class="action"><div id="user2-count"></div><div class="message">Соперник отвечает</div></div></div>');
            };
        /* -------------------- */

        /* set events for buttons */
            _setEvents=function(){
                var that = this;
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                $(document).on('click', '#btn-reload', function(){
                    window.location.reload();
                });

                $(document).on('click', '#btn-answer', function(){
                    duelStorage.remove('step_seconds');
                    clearInterval(stepInterval);

                    var question = duelStorage.get('question');
                    var num = 0;
                    var answerInput = $('input[name=answer]:checked');

                    if (answerInput && answerInput.val() == question.answer) {
                        num = 1;
                    }
                    socket.emit('move', {state: duelStorage.get('state'), marker: marker, num: num})
                });

                $(document).on('click', '.duel-time', function(){
                    methods.stop.call(that);
                });

            };
        /* -------------------- */

        /* set events for buttons */
        /* -------------------- */

            _integerDivision=function (x, y){
                return (x-x%y)/y;
            };

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

