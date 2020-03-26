<?php

namespace Dcat\Admin\Console\Development;

use Dcat\Admin\Admin;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Console\Command;

class LinkCommand extends Command
{
    /**
     * The console command signature.
     *
     * @var string
     */
    protected $signature = 'admin:dev:link';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $files = $this->laravel->make('files');

        $this->linkAssets($files);
        $this->linkTests($files);
    }

    /**
     * @param Filesystem $files
     *
     * @return void
     */
    protected function linkTests($files)
    {
        $target = base_path('tests');
        $testsPath = realpath(__DIR__.'/../../../tests');

        if (is_dir($testsPath)) {
            $result = $this->ask("The [{$testsPath}] directory already exists, are you sure to delete it? [yes/no]");

            if (strtolower($result) !== 'yes') {
                return;
            }

            $files->deleteDirectory($testsPath);
        }

        $files->link(
            $testsPath, $target
        );

        $this->info("The [$testsPath] directory has been linked.");
    }

    /**
     * @param Filesystem $files
     *
     * @return void
     */
    protected function linkAssets($files)
    {
        $basePath = Admin::asset()->getRealPath('@admin');
        $publicPath = public_path($basePath);

        if (! is_dir($publicPath.'/..')) {
            $files->makeDirectory($publicPath.'/..', 0755, true, true);
        }

        if (file_exists($publicPath)) {
            $this->warn("The [public/{$basePath}] directory already exists.");

            return;
        }

        $distPath = realpath(__DIR__ . '/../../../resources/dist');

        $files->link(
            $distPath, $publicPath
        );

        $this->info("The [$basePath] directory has been linked.");
    }
}
